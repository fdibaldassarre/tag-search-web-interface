
var tags_directive = {
  '.category_container' : {
      'element<-' : {
          '.category_name' : 'element.category.name',
          '.tag_name' : {
            'tag<-element.tags' : {
              '.' : 'tag.name',
              '.@id+' : 'tag.code'
            }
          }
      }
  }
}; 

function createDirectives(){
  F_TAGS_DIRECTIVE = $('#tag_container').compile(tags_directive);
}
