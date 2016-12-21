
var categories_directive = {
  'li' : {
      'category<-' : {
          '.' : 'category.name',
          '.@id+' : 'category.code'
      }
  }
};

var tag_directive = {
  'div' : {
    'tag<-' : {
      'span@id+' : 'tag.code',
      'span' : 'tag.name'
    }
  }
};

var used_tag_directive = {
  'span' : {
    'tag<-' : {
      '.@id+' : 'tag.code',
      '.' : 'tag.name'
    }
  }
};

var files_directive = {
  '.file_container' : {
    'file<-' : {
      '.@id+' : 'file.code',
      '.filename' : 'file.name',
      '.file_edit_download@href' : 'file.href' ,
      '.file_edit_link@href+' : 'file.code',
      '.cover@src' : 'file.thumb'
    }
  }
}

function createDirectives(){
  F_CATEGORIES_DIRECTIVE = $('#category_selector_list').compile(categories_directive);
  F_TAGS_DIRECTIVE = $('#tag_list').compile(tag_directive);
  F_USED_TAGS_DIRECTIVE = $('#used_tags_list').compile(used_tag_directive);
  F_FILES_DIRECTIVE = $('#file_container_all').compile(files_directive);
}
