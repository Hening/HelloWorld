require('../../lib/htmlparser');
require('../../conf/advertisingUrlConf');
require('./utils/saveAs');


var casper = require('separator').create('222');

casper.start();
casper.each(advertisingUrlConf,function(self,info){
	infos = info.split('--');
    var urlName = infos[0];
    var url222 = infos[1];
    // this.echo(urlName);
	// this.echo(url222);
    casper.thenOpen(url222,function(){
	    var contents = htmlparser.getHtmlNode(casper.getHTML(),'pre','pre');
	    json = JSON.parse(contents);
		if(json.Code == '0'){
			this.emit('code ok',urlName);
			try{
				values =json.Result[0].Value;
				//判断value主体是否是数组格式
				if(values instanceof Array){
					//解析广告中的LOGO和跳转页面
					for(var i=0,length=values.length;i<length;i++){
						var desc = values[i].Desc;//产品名称
						var logoUrl = values[i].LogoUrl;//LOGO
						var picType=logoUrl.substr(-3,3);//图片类型
						var urlStr = values[i].TargetUrl;//跳转地址
						urlStr = urlStr.replace(/amp;/g,'');
						// this.echo('urlStr='+urlStr);
						var pos = "./Advertising/"+urlName+"/"+desc+"/"+desc;//保存目录+产品名称
					
						this.download(logoUrl,pos+'.'+picType,'GET');//下载LOGO
						saveAs.capture(this,urlStr,pos);//保存跳转地址
					}
				}
			}catch(err){
				this.emit('json parse error',url222,err);
			}
		}		
	    else {
		    casper.test.assertEqual('0',json.Code,urlName + '------Interface(222) error: '+ json.Code);
	    } 
    });
});

casper.run();