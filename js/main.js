function loadStartupFunctions() {
  createDirectives();
  loadMainView();
  cleanSearchInput();
}

function addAllListeners() {
  // Reset category
  hookClick('current_category_reset', function() { showCategory(null); });
  // Show more files
  hookClick('filesview_show_more_btn', function() { showMore(); } );
  // Search bar
  $('#search_bar_search').click(function() { searchName(); });
  $('#name_pseudo_tag').click(function(){ searchRemoveName(); } )
  $('#search_bar_form').submit( function(){ searchName(); return false; } )
}

// Main variables
USED_TAGS = [];
VALID_TAGS = [];
ALL_TAGS = [];
FILES = [];
LIMIT = 9;

// Startup
addListener(window, "load", function(){ loadStartupFunctions(); addAllListeners(); });

// Main view
function loadMainView() { 
  var address = "/tagsearch/manager.py";
  var data = {op : 'get_tags', profile : PROFILE}
  $.getJSON(address, data, loadMainViewSuccess);
}

function loadMainViewSuccess(content) {
  writeTags(content);
  writeUsedTags();
  loadTagsListeners(content);
  loadCategoryListeners(content);
  ALL_TAGS = content['tags'];
  resetFilesView();
}

function loadMainViewFailure(content) {
  return null;
}

// Filesview
function updateFilesView() {
  var address = "/tagsearch/manager.py";
  var tags = getUsedTagsList();
  var name_contains = encodeURI($('#name_pseudo_tag_content').text());
  var data = {op : 'get_files', tags: tags, profile : PROFILE, name_contains : name_contains}
  if(tags.length > 0 || name_contains.length > 0)
    $.getJSON(address, data, updateFilesViewSuccess);
  else
    resetFilesView();
}

/*
function updateFilesViewRandom() {
  var address = "/tagsearch/manager.py";
  var data = {op : 'get_files_random', limit : 9, profile : PROFILE}
  $.getJSON(address, data, updateFilesViewRandomSuccess);
}*/

function updateFilesViewSuccess(content) {
  FILES = content['files'];
  writeFiles();
  VALID_TAGS = content['tags'];
  showValidTags();
  resetCategory();
}

function updateFilesViewRandomSuccess(content) {
  FILES = content['files'];
  writeFiles();
  VALID_TAGS = ALL_TAGS;
  showValidTags();
  resetCategory();
}

function updateFilesViewFailure(content) {
  return null;
}

function resetFilesView() {
  FILES = [];
  LIMIT = 9;
  writeFiles();
  VALID_TAGS = ALL_TAGS;
  showValidTags();
  resetCategory();
}

// Write
function writeTags(content) {
  var mdata = content['categories'];
  $('#category_selector_list').render(mdata, F_CATEGORIES_DIRECTIVE);
  var tdata = content['tags'];
  $('#tag_list').render(tdata, F_TAGS_DIRECTIVE);
}

function writeUsedTags() {
  $('#used_tags_list').render(USED_TAGS, F_USED_TAGS_DIRECTIVE);
  loadUsedTagsListeners();
}

function writeFiles() {
  var fdata = FILES.slice(0, LIMIT);
  $('#file_container_all').render(fdata, F_FILES_DIRECTIVE);
  if(FILES.length > 0 && LIMIT < FILES.length - 1){
    showFWShowMore(true);
  } else {
    showFWShowMore(false);
  }
}

function showMore() {
  LIMIT = LIMIT + 9;
  writeFiles();
}

function showFWShowMore(show) {
  var el = document.getElementById('filesview_show_more');
  if(show) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// Listeners
function loadTagsListeners(content) {
  var tdata = content['tags'];
  var tag = null;
  for(var i=0; i < tdata.length; i++){
    tag = tdata[i];
    addTagHooks(tag);
  }
}

function addTagHooks(tag) {
  hookClick('tag_item_' + tag.code, function() { useTag(tag) });
}

function loadUsedTagsListeners() { 
  var tag = null;
  for(var i=0; i < USED_TAGS.length; i++){
    tag = USED_TAGS[i];
    addUsedTagHooks(tag);
  }
}

function addUsedTagHooks(tag){
  hookClick('used_tag_' + tag.code, function() { removeTag(tag) });
}

function loadCategoryListeners(content){
  var mdata = content['categories'];
  var category = null;
  for(var i=0; i < mdata.length; i++){
    category = mdata[i];
    addCategoryHooks(category);
  }
}

function addCategoryHooks(category) {
  hookClick('category_item_' + category.code, function() { showCategory(category) });
}

// Category manager
function showCategory(category) {
  var tag = null;
  for(var i=0; i<VALID_TAGS.length; i++){
    tag = VALID_TAGS[i];
    if(category == null || tag.category == category.code){
      showTag(tag);
    } else {
      hideTag(tag);
    }
  }
  // Print the category name
  if(category == null){
    resetCategory();
  } else {
    showCategoryName(category.name);
  }
}

function showCategoryName(name){
  var el = document.getElementById('current_category_name');
  el.innerHTML = name;
  showResetCategoryBtn(true);
}

function resetCategory(){
  var el = document.getElementById('current_category_name');
  el.innerHTML = 'Select category';
  showResetCategoryBtn(false);
}

function showResetCategoryBtn(show){
  var el = document.getElementById('current_category_reset');
  if(show) {
    el.style.display = 'inline';
  } else {
    el.style.display = 'none';
  }
}


// Tag manager
function useTag(tag) {
  // Remove tag from used tags var
  USED_TAGS.push(tag);
  // Update used tags view
  writeUsedTags();
  // Update files view
  updateFilesView();
}

function removeTag(tag) {
  // Remove tag from used tags var
  var ti = USED_TAGS.indexOf(tag);
  if (ti > -1) {
    USED_TAGS.splice(ti, 1);
  }
  // Update used tags view
  writeUsedTags();
  // Update files view
  updateFilesView();
}

function showValidTags(){
  // Hide all tags
  var tag = null;
  for(var i=0; i<ALL_TAGS.length; i++){
    tag = ALL_TAGS[i];
    hideTag(tag);
  }
  // Show valid tags
  for(var i=0; i<VALID_TAGS.length; i++){
    tag = VALID_TAGS[i];
    showTag(tag);
  }
  // Hide used tags
  for(var i=0; i<USED_TAGS.length; i++){
    tag = USED_TAGS[i];
    hideTag(tag);
  }
}

function hideTag(tag){
  var el = document.getElementById('tag_item_' + tag.code);
  el.style.display = 'none';
}

function showTag(tag){
  var el = document.getElementById('tag_item_' + tag.code);
  el.style.display = 'inline-block';
}

function getUsedTagsList(){
  var res = '';
  var tag = null;
  for(var i=0; i<USED_TAGS.length; i++){
    tag = USED_TAGS[i];
    res = res + ',' + tag.code;
  }
  return res.substring(1);
}

// Search bar functions
function searchName(){
  var name = $('#filename_input').prop('value');
  if( name.length > 0 ){
    showNameSearch(name);
    updateFilesView();
  }
}

function searchRemoveName(){
  hideNameSearch();
  updateFilesView();
}

function showNameSearch(name){
  $('#name_pseudo_tag_content').text(name);
  $('#name_pseudo_tag').css('display', 'inline-block');
}

function hideNameSearch(){
  $('#name_pseudo_tag_content').text('');
  $('#name_pseudo_tag').css('display', 'none');
}

function cleanSearchInput(){
  $('#filename_input').prop('value', '');
}
