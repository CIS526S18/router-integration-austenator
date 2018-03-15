
const url = require('url');


function Router(){
  this.routemap = {
    'GET':[],
    'POST':[]
  };
}

// Routes the request to the appropriate function.
Router.prototype.route = function(req, res) {

  // Extract resource path.
  //
  var resource = url.parse(req.url).pathname;

  var verb = req.method;

  for(var i=0;i<this.routemap[verb].length;i++){
    var match = this.routemap[verb][i].regexp.exec(resource);

    if(match != null){
      var params = {};
      for(var j = 0; j<this.routemap[verb][i].keys.length; j++){
        params[this.routemap[verb][i].keys[j]] = match[j+1];
      }

      // store params in req
      req.params = params;
      return this.routemap[verb][i].callback(req, res);
    }
  }

  res.statusCode = 404;
  res.end('Lmao not found');
}

// Add new Routes
Router.prototype.addRoute = function(httpVerb, route, callback){
  var tokens = route.split('/');
  var exp = [];
  var keys = [];

  // Convert route pattern to a regular expressions
  for(var i = 0; i < tokens.length; i++){
    var match = tokens[i].match(/:(\w+)/);
    if(match){
      exp.push("([^\/]+)");
      keys.push(match[1]);

    }else{
      exp.push(tokens[i]);
    }
  }

  regexp = new RegExp('^' + exp.join('/') + '/?$');

  // Add to routemap.
  this.routemap[httpVerb].push({
    regexp: regexp,
    keys: keys,
    callback: callback
  });
}

module.exports = Router;
