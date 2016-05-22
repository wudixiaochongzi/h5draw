var canvas,cobj,copy,a;
//操作工具
var createBtn=document.querySelector('.create');
var draw=document.querySelector('.draw');
createBtn.onclick=function(){
	var w=prompt("请输入画布的宽：");
	var h=prompt("请输入画布的高：");
	// console.log(Number(w));
	// var w=600;
	// var h=600;
	if (!Number(w)||!Number(h)) {
		alert("请输入正确的宽高");
		return;
	};
	var str="";
	str+="<canvas width="+w+" height="+h+"></canvas><div class='copy'></div>";
	draw.innerHTML=str;
	canvas=document.querySelector("canvas");
	cobj=canvas.getContext('2d');
	copy=document.querySelector('.copy');
	copy.style.cssText+="width:"+w+"px;height:"+h+"px";
	a=new palette(cobj,canvas,copy);
	paint();
	a.draw();
}

function paint(){
	// 铅笔工具切换
	var pencilBtn=document.querySelector(".pencil");
	pencilBtn.onclick=function(){
		this.flag=!this.flag;
		a.opation=this.flag;
		a.draw();
		if (this.flag) {
			this.style.cssText+="background-color:#fff;border:1px solid #666";
			for(var i=0;i<typebtn.length;i++){
				typebtn[i].style.cssText="background-color:#ccc;border:none";
			}
		}else{
			this.style.cssText+="background-color:#ccc;border:none";
		}
	}
	//选择画图形状
	var typebtn=document.querySelectorAll(".typetools button");
	for(var i=0; i<typebtn.length; i++){
		typebtn[i].onclick=function(){
			if (this.id=="poly") {
				var polychoose=prompt("请输入多变形的边数：");
				if (Number(polychoose)) {
					a.polyNum=polychoose;
				};
				
			}else if (this.id=="jiao") {
				var jiaochoose=prompt("请输入星形的角数：");
				if (Number(jiaochoose)) {
					a.jiaoNum=jiaochoose;
				}
			}else if (this.id=="roundrect") {
				var roundrectchoose=prompt("请输入圆角的半径（像素）：");
				if (Number(roundrectchoose)) {
					a.roundrectR=roundrectchoose;
				}
			}
			a.type=this.id;
			pencilBtn.flag=0;
			a.opation=0;
			a.draw();
			pencilBtn.style.cssText+="background-color:#ccc;border:none";
			for(var j=0;j<typebtn.length;j++){
				typebtn[j].style.cssText="background-color:#ccc;border:none";
			}
			this.style.cssText+="background-color:#fff;border:1px solid #666";
		}
	}

	//选择填充还是描边
	var fillcheck=document.querySelector('.fillcolorbox input[type=checkbox]');
	var strokecheck=document.querySelector('.strokecolorbox input[type=checkbox]');
	fillcheck.onclick=strokecheck.onclick=function(){
		if (fillcheck.checked==true&&strokecheck.checked!=true) {
			a.style=1;
		}else if (strokecheck.checked==true&&fillcheck.checked!=true) {
			a.style=0;
		}else if (strokecheck.checked==true&&fillcheck.checked==true) {
			a.style=2;
		};
	}

	//填充颜色选择、描边颜色选择
	var fillcolor=document.querySelector('.fillcolorbox input[type=color]');
	var strokecolor=document.querySelector('.strokecolorbox input[type=color]');
	fillcolor.onchange=function(){
		a.fillStyle=this.value;
	}
	strokecolor.onchange=function(){
		a.strokeStyle=this.value;
	}

	//选择线宽
	var linewidth=document.querySelector("select");
	linewidth.onchange=function(){
		var index=linewidth.selectedIndex ; 
		a.lineWidth=linewidth.options[index].innerHTML;
	}

	//保存
	var download=document.querySelector('.download');
	download.onclick=function(){
		window.location.href=canvas.toDataURL("image/png",1).replace("image/png","image/octet-stream; Content-Disposition:attachment; filename=foobar.png");
	}

	//撤销、恢复
	var goback=document.querySelector('.goback');
	var regain=document.querySelector('.regain');
	goback.onclick=function(){
		if (a.history.length==1) {
			a.regain.push(a.history[a.history.length-1]);
			a.history.pop();
			a.cobj.clearRect(0,0,a.cwidth,a.cheight);
			return;
		}else if(a.history.length>1){
			a.regain.push(a.history[a.history.length-1]);
			a.history.pop();
			a.cobj.putImageData(a.history[a.history.length-1],0,0);
		}	
	}
	regain.onclick=function(){
		if (a.regain.length>0) {
			a.cobj.putImageData(a.regain[a.regain.length-1],0,0);
			a.history.push(a.regain[a.regain.length-1]);
			a.regain.pop();
			return;
		};
	}
}