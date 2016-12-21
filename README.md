# TagSearch - Web interface
Web interface for the tag search program.

## Notes

Do not use this interface on a public facing server.

## Requirements

- [TagSearch](https://github.com/fdibaldassarre/tag-search)
- [JQuery](http://jquery.com/)
- [Pure.js](https://beebole.com/pure/)
- [FontAwesome](http://fontawesome.io/)

## Installation

- Copy all the files to /var/www/tag-search.

- Put pure.js and jquery.js in /var/www/tag-search/js/ and font-awesome.css in /var/www/tag-search/css/.

- (Optional) Put a logo.png and a missing_thumb.png in /var/www/tag-search/images/.

## Configuration

I assume you have already setup tag-search and are using the default profile.

Link files and thumbnails

```sh
ln -s -T ~/TagSearch /var/www/tag-search/archive/default
```

```sh
ln -s -T ~/.config/tag-search/default/thumbnails /var/www/tag-search/thumbs/default
```

Note: to download the files make sure the server has read access to the ~/TagSearch folder.

## Nginx configuration

Enable the configuration nginx.conf
```sh
cp nginx.conf /etc/nginx/sites-enables/tagsearch.conf
```

## Run

Start the server.py from tag-search and access the webinterface from 127.0.0.1/tag-search/
