if(!window.EWModalbox)var EWModalbox={};
EWModalbox.Methods={focusableElements:[],currFocused:0,initialized:!1,active:!0,pExecutor:0,options:{positionType:"absolute",title:"&nbsp;",width:500,height:90,overlay:!0,maxTop:0,overlayClose:!0,overlayOpacity:0.65,overlayDuration:0.25,slideDownDuration:0.5,slideUpDuration:0.5,resizeDuration:0.25,inactiveFade:!0,transitions:!0,loadingString:"Please wait. Loading...",closeString:"Close window",closeValue:"&times;",params:{},method:"get",autoFocusing:!0},_options:{},setOptions:function(a){Object.extend(this.options,
a||{})},_init:function(a){Object.extend(this._options,this.options);this.setOptions(a);this.MBoverlay=new Element("div",{id:"EWMOverlay",opacity:"0"});this.options.overlay||$(this.MBoverlay).setStyle({display:"none"});a="position: fixed!important; display:none;";"absolute"==this.options.positionType&&(a="position: absolute!important; display:none;");this.MBwindow=(new Element("div",{id:"EWMWindow",style:a})).update(this.MBframe=(new Element("div",{id:"EWMFrame"})).update(this.EWMHeader=(new Element("div",
{id:"EWMHeader"})).update(this.MBcaption=new Element("div",{id:"EWMCaption"}))));this.MBclose=(new Element("a",{id:"EWMClose",title:this.options.closeString,href:"#"})).update("<span>"+this.options.closeValue+"</span>");this.EWMHeader.insert({bottom:this.MBclose});this.MBcontent=(new Element("div",{id:"EWMContent"})).update(this.MBloading=(new Element("div",{id:"EWMLoading"})).update(this.options.loadingString));this.MBframe.insert({bottom:this.MBcontent});a=$(document.body);a.insert({bottom:this.MBwindow});
a.insert({bottom:this.MBoverlay});this.initScrollX=window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft;this.initScrollY=window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;this.hideObserver=this._hide.bindAsEventListener(this);this.kbdObserver=this._kbdHandler.bindAsEventListener(this);this._initObservers();this.initialized=!0;this.center()},show:function(a,b){this._p&&this._p.stop();this.initialized||this._init(b);this.content=a;this.setOptions(b);
this.options.title&&$(this.MBcaption).update(this.options.title);"none"==this.MBwindow.style.display?(this._appear(),this.event("onShow")):(this._update(),this.resizeModal(),this.event("onUpdate"))},hide:function(a,b){this._p&&this._p.stop();0<a?this._p=new PeriodicalExecuter(function(a){a.stop();this.hide(0,b)}.bind(this),a):(this.pExecutor&&(this.pExecutor.stop(),this.pExecutor=0),this.initialized&&(b&&"function"!=typeof b.element&&Object.extend(this.options,b),this.event("beforeHide"),this.options.transitions?
Effect.SlideUp(this.MBwindow,{duration:this.options.slideUpDuration,transition:Effect.Transitions.sinoidal,afterFinish:this._deinit.bind(this)}):($(this.MBwindow).hide(),this._deinit())))},_hide:function(a){a.stop();if("EWMOverlay"==a.element().id&&!this.options.overlayClose)return!1;this.hide()},_appear:function(){Prototype.Browser.IE&&7>Prototype.BrowserFeatures.Version&&(window.scrollTo(0,0),this._prepareIE("100%","hidden"));this._setWidth();this._setPosition();this.options.transitions?($(this.MBoverlay).setStyle({opacity:0}),
new Effect.Fade(this.MBoverlay,{from:0,to:this.options.overlayOpacity,duration:this.options.overlayDuration,afterFinish:function(){new Effect.SlideDown(this.MBwindow,{duration:this.options.slideDownDuration,transition:Effect.Transitions.sinoidal,afterFinish:function(){this._setPosition();this.loadContent()}.bind(this)})}.bind(this)})):($(this.MBoverlay).setStyle({opacity:this.options.overlayOpacity}),$(this.MBwindow).show(),this._setPosition(),this.loadContent());this._setWidthAndPosition=this._setWidthAndPosition.bindAsEventListener(this);
Event.observe(window,"resize",this._setWidthAndPosition)},resizeModal:function(a){a||(a={});a.oheight=$(this.MBcontent).getHeight();a.ohheight=$(this.EWMHeader).getHeight();a.owidth=$(this.MBwindow).getWidth();this.MBcontent.setStyle({height:""});EWModalbox.resize(this.options.width-$(this.MBwindow).getWidth(),$(this.MBcontent).getHeight()-$(this.MBwindow).getHeight()+$(this.EWMHeader).getHeight(),a);this.center()},resize:function(a,b,c){var f=document.viewport.getDimensions();$(this.MBoverlay).getWidth();
var d=$(this.MBwindow).getHeight(),g=$(this.MBwindow).getWidth(),e=$(this.EWMHeader).getHeight(),h=$(this.MBcontent).getHeight();b=d-e+b<h?h+e:d+b;b>f.height&&(b=f.height-5);a=g+a;c&&this.setOptions(c);this.MBwindow.setStyle({width:a+"px",height:b+"px"});setTimeout(function(){this.event("_afterResize");this.event("afterResize");this.MBcontent.setStyle({height:$(this.MBframe).getHeight()-e-13+"px",overflow:"auto"})}.bind(this),1);d==b&&g==a?this.pExecutor&&this.pExecutor.stop():this.pExecutor||(this.pExecutor=
new PeriodicalExecuter(function(a){this.resizeModal()}.bind(this),0.25))},center:function(){var a=document.viewport.getDimensions(),b=0;"absolute"==this.options.positionType&&(b=document.viewport.getScrollOffsets().top);a=parseInt((a.height-$(this.MBwindow).getHeight())/2);a>this.options.maxTop&&(a=this.options.maxTop);var c=0;0<a&&(c=a);this.MBwindow.setStyle({top:c+b+"px"})},_update:function(){this.MBcontent.setStyle({height:"auto"});$(this.MBcontent).update($(this.MBloading).update(this.options.loadingString));
this.loadContent()},loadContent:function(){!1!=this.event("beforeLoad")&&("string"==typeof this.content?RegExp(/<\/?[^>]+>/gi).test(this.content)?this._insertContent(this.content.stripScripts(),function(){this.content.extractScripts().map(function(a){try{window.execScript?window.execScript(a):window.setTimeout(a,0)}catch(b){}}.bind(window))}.bind(this)):new Ajax.Request(this.content,{method:this.options.method.toLowerCase(),parameters:this.options.params,onSuccess:function(a){var b=new String(a.responseText);
this._insertContent(a.responseText.stripScripts(),function(){b.extractScripts().map(function(a){try{window.execScript?window.execScript(a):window.setTimeout(a,0)}catch(b){}}.bind(window))}.bind(this))}.bind(this),onException:function(a,b){EWModalbox.hide();throw"EWModalbox Loading Error: "+b;}}):"object"!=typeof this.content&&EWModalbox.hide())},_insertContent:function(a,b){$(this.MBcontent).hide().update("");if("string"==typeof a)this.MBcontent.update((new Element("div",{style:"display: none"})).update(a)).down().show();
else if("object"==typeof a){var c=a.cloneNode(!0);a.id&&(a.id="MB_"+a.id);$(a).select("*[id]").each(function(a){a.id="MB_"+a.id});this.MBcontent.update(c).down("div").show();Prototype.Browser.IE&&$$("#EWMContent select").invoke("setStyle",{visibility:""})}setTimeout(function(){this._putContent(b)}.bind(this),1)},_putContent:function(a){this.MBcontent.show();this.resizeModal();this.focusableElements=this._findFocusableElements();this._setFocus();void 0!=a&&a();this.event("afterLoad")},_initObservers:function(){$(this.MBclose).observe("click",
this.hideObserver);this.options.overlayClose&&$(this.MBoverlay).observe("click",this.hideObserver);Prototype.Browser.Gecko?Event.observe(document,"keypress",this.kbdObserver):Event.observe(document,"keydown",this.kbdObserver)},_removeObservers:function(){$(this.MBclose).stopObserving("click",this.hideObserver);this.options.overlayClose&&$(this.MBoverlay).stopObserving("click",this.hideObserver);Prototype.Browser.Gecko?Event.stopObserving(document,"keypress",this.kbdObserver):Event.stopObserving(document,
"keydown",this.kbdObserver)},_setFocus:function(){if(0<this.focusableElements.length&&!0==this.options.autoFocusing){var a=this.focusableElements.find(function(a){return 1==a.tabIndex})||this.focusableElements.first();this.currFocused=this.focusableElements.toArray().indexOf(a);a.focus()}else $(this.MBclose).visible()&&$(this.MBclose).focus()},_findFocusableElements:function(){this.MBcontent.select("input:not([type~=hidden]), select, textarea, button, a[href]").invoke("addClassName","MB_focusable");
return this.MBcontent.select(".MB_focusable")},_kbdHandler:function(a){var b=a.element();switch(a.keyCode){case Event.KEY_TAB:a.stop();b!=this.focusableElements[this.currFocused]&&(this.currFocused=this.focusableElements.toArray().indexOf(b));a.shiftKey?0==this.currFocused?(this.focusableElements.last().focus(),this.currFocused=this.focusableElements.length-1):(this.currFocused--,this.focusableElements[this.currFocused].focus()):this.currFocused==this.focusableElements.length-1?(this.focusableElements.first().focus(),
this.currFocused=0):(this.currFocused++,this.focusableElements[this.currFocused].focus());break;case Event.KEY_ESC:this.active&&this._hide(a);break;case 32:this._preventScroll(a);break;case 0:32==a.which&&this._preventScroll(a);break;case Event.KEY_UP:case Event.KEY_DOWN:case Event.KEY_PAGEDOWN:case Event.KEY_PAGEUP:case Event.KEY_HOME:case Event.KEY_END:Prototype.Browser.WebKit&&!["textarea","select"].include(b.tagName.toLowerCase())?a.stop():("input"==b.tagName.toLowerCase()&&["submit","button"].include(b.type)||
"a"==b.tagName.toLowerCase())&&a.stop()}},_preventScroll:function(a){["input","textarea","select","button"].include(a.element().tagName.toLowerCase())||a.stop()},_deinit:function(){this._removeObservers();Event.stopObserving(window,"resize",this._setWidthAndPosition);this.options.transitions&&this.options.overlay?Effect.toggle(this.MBoverlay,"appear",{duration:this.options.overlayDuration,afterFinish:this._removeElements.bind(this)}):(this.MBoverlay.hide(),this._removeElements());$(this.MBcontent).setStyle({overflow:"",
height:""})},_removeElements:function(){$(this.MBoverlay).remove();$(this.MBwindow).remove();Prototype.Browser.IE&&!navigator.appVersion.match(/\b7.0\b/)&&(this._prepareIE("",""),window.scrollTo(this.initScrollX,this.initScrollY));"object"==typeof this.content&&(this.content.id&&this.content.id.match(/MB_/)&&(this.content.id=this.content.id.replace(/MB_/,"")),this.content.select("*[id]").each(function(a){a.id=a.id.replace(/MB_/,"")}));this.initialized=!1;this.event("afterHide");this.setOptions(this._options)},
_setWidth:function(){$(this.MBwindow).setStyle({width:this.options.width+"px",height:this.options.height+"px"})},_setPosition:function(){$(this.MBwindow).setStyle({left:($(this.MBoverlay).getWidth()-$(this.MBwindow).getWidth())/2+"px"})},_setWidthAndPosition:function(){$(this.MBwindow).setStyle({width:this.options.width+"px"});this._setPosition();this.resizeModal()},_getScrollTop:function(){var a;document.documentElement&&document.documentElement.scrollTop?a=document.documentElement.scrollTop:document.body&&
(a=document.body.scrollTop);return a},_prepareIE:function(a,b){$$("html, body").invoke("setStyle",{width:a,height:a,overflow:b});$$("select").invoke("setStyle",{visibility:b})},event:function(a){if(this.options[a]){var b=this.options[a]();this.options[a]=null;if(void 0!=b)return b}return!0}};Object.extend(EWModalbox,EWModalbox.Methods);