function palette (cobj,canvas,copy) {
	this.cobj=cobj;
	this.canvas=canvas;
	this.copy=copy;
	this.cwidth=canvas.width;
	this.cheight=canvas.height;
	this.lineWidth=1;
	this.fillStyle="#FF8040";
	this.strokeStyle="#0080FF";
	this.type="line";     //line   rect    arc   poly   jiao   pencil
	this.style=0;  //0:stroke   1:fill  2:all
	this.history=[];
	this.regain=[];
	this.polyNum=5;
	this.jiaoNum=5;
	this.opation=0;  //1：选择铅笔工具
	this.roundrectR=10;
};
palette.prototype.pencil = function() {
	var that=this;
	that.copy.onmousedown=function(e){
		var dx=e.offsetX;
		var dy=e.offsetY;
		that.reset();
		that.cobj.beginPath();
		that.copy.onmousemove=function(e){
			var mx=e.offsetX;
			var my=e.offsetY;
			that.cobj.lineTo(mx,my);
			that.cobj.stroke();
		}
		document.onmouseup=function(){
			that.cobj.closePath();
			that.copy.onmousemove=null;
			document.onmouseup=null;
			that.history.push(that.cobj.getImageData(0,0,that.cwidth,that.cheight));
		}
	}
};
palette.prototype.draw = function() {
	if (this.opation==1) {
		this.pencil();
		return;
	};
	var that=this;
	that.copy.onmousedown=function(e){
		var dx=e.offsetX;
		var dy=e.offsetY;
		that.reset();
		that.copy.onmousemove=function(e){
			var mx=e.offsetX;
			var my=e.offsetY;
			that.cobj.clearRect(0,0,that.cwidth,that.cheight);
			if (that.history.length>0) {
				for(var i=0;i<that.history.length;i++){
					that.cobj.putImageData(that.history[i],0,0);
				}
			};
			that[that.type](dx,dy,mx,my);
		}
		document.onmouseup=function(){
			that.copy.onmousemove=null;
			document.onmouseup=null;
			that.history.push(that.cobj.getImageData(0,0,that.cwidth,that.cheight));
		}
	}
};
palette.prototype.reset=function(){
	this.cobj.fillStyle=this.fillStyle;
	this.cobj.strokeStyle=this.strokeStyle;
	this.cobj.lineWidth=this.lineWidth;
}
palette.prototype.line = function(x1,y1,x2,y2) {
	this.cobj.beginPath();
	this.cobj.lineTo(x1,y1);
	this.cobj.lineTo(x2,y2);
	this.cobj.stroke();
	this.cobj.closePath();
};
palette.prototype.rect=function(x1,y1,x2,y2){
	if (this.lineWidth%2!=0) {
		x1+=0.5;
		y1+=0.5;
		x2+=0.5;
		y2+=0.5;
	};
	this.cobj.beginPath();
	this.cobj.rect(x1,y1,x2-x1,y2-y1);
	this.cobj.closePath();
	if (this.style==0) {
		this.cobj.stroke();
	}else if(this.style==1){
		this.cobj.fill();
	}else if(this.style==2){
		this.cobj.stroke();
		this.cobj.fill();
	}
};
palette.prototype.arc=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	// console.log(r);
	this.cobj.beginPath();
	this.cobj.arc(x1,y1,r,2*Math.PI,0,false);
	this.cobj.closePath();
	if (this.style==0) {
		this.cobj.stroke();
	}else if(this.style==1){
		this.cobj.fill();
	}else if(this.style==2){
		this.cobj.stroke();
		this.cobj.fill();
	}
};
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var len=this.polyNum;
	var ang=360/len;
	this.cobj.beginPath();
	for(var i=0; i<len; i++){
		this.cobj.lineTo(x1+Math.cos(i*ang*Math.PI/180)*r,y1+Math.sin(i*ang*Math.PI/180)*r);
	}
	this.cobj.closePath();
	if (this.style==0) {
		this.cobj.stroke();
	}else if(this.style==1){
		this.cobj.fill();
	}else if(this.style==2){
		this.cobj.stroke();
		this.cobj.fill();
	}
};
palette.prototype.jiao=function(x1,y1,x2,y2){
	var r1=this._r(x1,y1,x2,y2);
	var r2=r1/2.5;
	var len=this.jiaoNum*2;
	var ang=360/len;
	this.cobj.beginPath();
	for(var i=0; i<len; i++){
		if (i%2==0) {
			this.cobj.lineTo(x1+Math.cos(i*ang*Math.PI/180)*r1,y1+Math.sin(i*ang*Math.PI/180)*r1);
		}else if (i%2!=0) {
			this.cobj.lineTo(x1+Math.cos(i*ang*Math.PI/180)*r2,y1+Math.sin(i*ang*Math.PI/180)*r2);
		};
		
	}
	this.cobj.closePath();
	if (this.style==0) {
		this.cobj.stroke();
	}else if(this.style==1){
		this.cobj.fill();
	}else if(this.style==2){
		this.cobj.stroke();
		this.cobj.fill();
	}
}
palette.prototype.roundrect=function(x1,y1,x2,y2){
	if (this.lineWidth%2!=0) {
		x1+=0.5;
		y1+=0.5;
		x2+=0.5;
		y2+=0.5;
	};
	var w=x2-x1;
	var h=y2-y1;
	var r=this.roundrectR;
	if (Math.abs(w) < 2*r) {
		r=Math.abs(w)/2;
	}
	if (Math.abs(h)<2*r){
		r=Math.abs(h)/2;
	}
	var x0;
	if (w>0) {
		x0=x1+r;
	}else {
		x0=x1-r;
	}
	this.cobj.beginPath();
	this.cobj.moveTo(x0, y1);
	this.cobj.arcTo(x2, y1, x2, y2, r);
	this.cobj.arcTo(x2, y2, x1, y2, r);
	this.cobj.arcTo(x1, y2, x1, y1, r);
	this.cobj.arcTo(x1, y1, x2, y1, r);
	// this.cobj.lineTo(x0, y1);
	this.cobj.closePath();
	if (this.style==0) {
		this.cobj.stroke();
	}else if(this.style==1){
		this.cobj.fill();
	}else if(this.style==2){
		this.cobj.stroke();
		this.cobj.fill();
	}
}
palette.prototype._r=function(x1,y1,x2,y2){
	var r=Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
	return r;
}