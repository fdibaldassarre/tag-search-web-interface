function loadStartupFunctions() {
  createDirectives();
  loadTags();
}

function addAllListeners() {
  return null;
}

// Startup
addListener(window, "load", function(){ loadStartupFunctions(); addAllListeners(); })

// Variables
FILE_CODE = null
TAGS = []
CATEGORIES = []

// Load tags
function loadTags(){
  var address = "/tagsearch/manager.py";
  var data = {op : 'get_tags', profile : PROFILE}
  $.getJSON(address, data, loadTagsSuccess);
}

function loadTagsSuccess(content) {
  extractTagData(content);
  var ncontent = reorganizeTags();
  createTagList(ncontent);
  loadMainView();
}

function extractTagData(content){
  TAGS = content['tags'];
  CATEGORIES = content['categories'];
}

function reorganizeTags(content){
  var result = [];
  var category = null;
  for(var i=0; i<CATEGORIES.length; i++){
    category = CATEGORIES[i];
    result.push({category : category, tags: []})
  }
  var tag = null;
  var category_data = null;
  for(var i=0; i<TAGS.length; i++){
    tag = TAGS[i];
    for(var j=0; j<result.length; j++){
      category_data = result[j];
      if(category_data.category.code == tag.category){
        category_data.tags.push(tag);
        break;
      }
    }
  }
  return result;
}

// Load main view
function loadMainView() { 
  var address = "/tagsearch/manager.py";
  FILE_CODE = QueryString.code;
  var data = {op : 'get_file_tags', profile : PROFILE, code : FILE_CODE};
  console.log('Request data');
  $.getJSON(address, data, loadMainViewSuccess);
}

function loadMainViewSuccess(content) {
  createInfoPage(content);
}

function loadMainViewFailure(content) {
  return null;
}

// Create tag list
function createTagList(content){
  $('#tag_container').render(content, F_TAGS_DIRECTIVE);
}

// Show
function createInfoPage(content){
  compileInfo(content);
}

function compileInfo(content){
  var fileinfo = content['file'];
  var tags = content['tags'];
  $('#name').text(fileinfo.name);
  $('#cover').prop('src', fileinfo.thumb);
  $('#read-div').prop('href', fileinfo.href);
  var tag = null;  
  for(var i=0; i<tags.length; i++){
    tag = tags[i];
    $('#tag_' + tag.code).prop('class', 'tag-active');
  }
  // Add tags listeners
  addTagsListeners();
}


// Tag listener
function addTagsListeners(manga_tags){
  var tag = null;
  for(var i=0; i<TAGS.length; i++){
    tag = TAGS[i];
    addToggleTagHooks(tag);
  }
}

function addToggleTagHooks(tag){
  $('#tag_' + tag.code).click(function() { toggleTag(tag); });
}

// Tag management
function toggleTag(tag){
  var address = "/tagsearch/manager.py";
  var data = {op : 'toggle_tag_for_file', profile : PROFILE, code : FILE_CODE, code_tag : tag.code}
  $.getJSON(address, data, toggleTagSuccess(tag));
}

function toggleTagSuccess(tag){
  return function _(){
    if( $('#tag_' + tag.code).prop('class') == 'tag-active' )
      $('#tag_' + tag.code).prop('class', 'tag_name');
    else
      $('#tag_' + tag.code).prop('class', 'tag-active');
  }
}
