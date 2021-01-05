var fs = require("fs");
var srepo = "<div class=\"col-6 mb-3\"><a href=\"/repo?name={{cid}}_{{fid}}_{{name}}\"  class=\"repolink\" style=\"text-decoration: none;color: inherit;\"><div class=\"card repocard\">    <div class=\"card-body\">        <h5 class=\"card-title\">{{name}}</h5>    <h6 class=\"card-subtitle mb-2 text-muted\">{{cid}}</h6>     <p class=\"card-text\">Your description</p>               </div></div></a></div>"
var frepo = "<div class=\"col-6 mb-3\"><a href=\"/topic?name={{name}}&cid={{cid}}\" class=\"repolink\" style=\"text-decoration:none;color:inherit;\">    <div class=\"card repocard\" id=\"elm\">        <div class=\"card-body\">            <h5 class=\"card-title\" style=\"\">{{name}}</h5>           <h6 class=\"card-subtitle mb-3 text-muted\">{{cid}} | {{batch}}</h6>            <h6 class=\"card-subtitle mb-2 text-muted\">Deadline: {{date}}</h6>                 </div>    </div></a></div>"
var fl = "<a href=\"\" onclick=\"fopen(this)\"><li class=\"list-group-item p-2 pl-3\">{{name}}</li></a>"
var fsub = "<td>{{sid}}</td><td>{{sname}}</td><td>{{batch}}</td><td>{{sdate}}</td><td><a href=\"\" onclick=\"fopen(this, {{sid}})\">Download</a></li></td></tr>"
var create = "<option value=\"{{cid}}~{{fid}}~{{name}}\">{{cname}}({{cid}}) | {{fname}}({{fid}}) | {{name}}</option>"
var fcreate = "<option value=\"{{cid}}\">{{cid}} | {{cname}}</option>"
var prep = "<tr><td>{{f1}}</td><td>{{f2}}</td><td>{{per}}</td></tr>"
function mergeValues(tmpName, values, content) {
  let div = ""
  values.forEach(function(value){
    let tmp = ""; 
    switch(tmpName){
      case 'profile':
        tmp = srepo;
        break;
      case 'fprofile':
        tmp = frepo;
        break;
      case 'repo':
        tmp = fl;
        break;
      case 'topic':
        tmp = fsub;
        break;  
      case 'exrepo':
        tmp = create;
        break;       
      case 'crtopic':
      case 'plag':
        tmp = fcreate;
        break;   
      case 'prep'  :
      tmp = prep;
      break;
    }
  for (var key in value) {
    
    tmp = tmp.replace(new RegExp("{{" + key + "}}", 'g'), value[key]);
    
    }
  div+=tmp;
  });
  content = content.replace("{{dy"+tmpName+"}}", div);
  
  return content;
}

function view(templateName, names, values, res) {
  var fileContent = hfview(templateName);
  for(var key in names)
    fileContent = fileContent.replace(new RegExp("{{"+key+"}}", 'g'), names[key]);
  fileContent = mergeValues(templateName, values, fileContent);
  res.write(fileContent);
}

module.exports.view = view;

function viewFile(name, code, res) {
  var fileContent = hfview('file'); 
  fileContent = fileContent.replace('{{name}}', name);
  fileContent = fileContent.replace('{{code}}', code);
  fileContent = fileContent.replace('{{diff}}', '');
  res.write(fileContent);
}

module.exports.viewFile = viewFile;

function hfview(templateName) {
  var fileContent = fs.readFileSync('./views/' + templateName + '.html', 'utf8');
  let str = fs.readFileSync('./views/header.html', 'utf8');
  fileContent = fileContent.replace('{{header}}', str);
  str = fs.readFileSync('./views/fheader.html', 'utf8');
  fileContent = fileContent.replace('{{fheader}}', str);
  str = fs.readFileSync('./views/footer.html', 'utf8');
  fileContent = fileContent.replace('{{footer}}', str);
  return fileContent;
}

module.exports.hfview = hfview;

function viewRep(data, res) {
  var fileContent = hfview('prep'); 
  var div = '';
  data = data.toString()
  //console.log(data)
  data = data.split('@START')
  for(var i = 0; i < data.length; i++){
    var tb = '';
    da = data[i].split('\n')
    
    
    div += '<table class=\"table table-bordered m-3 mb-5\">    <thead class=\"thead thead-light text-center\">        <tr>        <th style=\"width:50%;\">'+da[1]+'</th>	        <th style=\"width:50%;\">'+da[2]+'</th>	        </tr>	    </thead>	    <tbody style=\"font-size:14px;\"><tr>'+da[3]+'</tr></tbody>	</table>'
    // console.log(div, tb)
    // div = mergeValues('prep', tb, div);
    // console.log(div)
  }
  fileContent.replace('{{prep}}', div);
  res.write(fileContent);
}

module.exports.viewRep = viewRep;