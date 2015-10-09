page.base('/blog');

page('/', index);
page('/write', write);
page();

function index() {
  console.log('welcome to blog');
}
function write(){
  console.log('ready to write!');
}

