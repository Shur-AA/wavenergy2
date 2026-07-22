var Service = require('node-windows').Service;
require('dotenv').config();

// Create a new service object
var svc = new Service({
  name:'Wavenergy_service',
  description: 'The nodejs wevenergy web server',
  script: 'D:/wavenergy/wavenergy2/js/app1.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
