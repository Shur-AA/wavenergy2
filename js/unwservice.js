var Service = require('node-windows').Service;
require('dotenv').config();

// Create a new service object
var svc = new Service({
  name:'Wavenergy_service',
  script: 'D:/wavenergy/wavenergy2/js/app.js'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();
