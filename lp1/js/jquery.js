(function(c,f){c.browser={msie:(navigator.appName=="Microsoft Internet Explorer")?true:false,mozilla:(navigator.appName=="Mozilla")?true:false};c.fn.extend({revolution:function(y){var z={delay:9000,startheight:490,startwidth:890,hideThumbs:200,thumbWidth:100,thumbHeight:50,thumbAmount:5,navigationType:"both",navigationArrows:"nexttobullets",navigationStyle:"round",touchenabled:"on",onHoverStop:"on",navOffsetHorizontal:0,navOffsetVertical:20,shadow:1};y=c.extend({},c.fn.revolution.defaults,y);return this.each(function(){var C=y;C.slots=4;C.act=-1;C.next=0;C.origcd=C.delay;C.firefox13=(c.browser.mozilla&&parseInt(c.browser.version,0)==13);if(C.navOffsetHorizontal==f){C.navOffsetHorizontal=0}if(C.navOffsetVertical==f){C.navOffsetVertical=0}C.navOH=C.navOffsetHorizontal;C.navOV=C.navOffsetVertical;var A=c(this);A.append('<div class="tp-loader"></div>');var B=A.find(".tp-bannertimer");if(B.length>0){B.css({width:"0%"})}A.addClass("tp-simpleresponsive");C.container=A;C.slideamount=A.find("ul:first li").length;if(C.startwidth==f||C.startwidth==0){C.startwidth=A.width()}if(C.startheight==f||C.startheight==0){C.startheight=A.height()}C.width=A.width();C.height=A.height();C.bw=C.startwidth/A.width();C.bh=C.startheight/A.height();if(C.width!=C.startwidth){C.height=Math.round(C.startheight*(C.width/C.startwidth));A.height(C.height)}if(C.shadow!=0){A.parent().append('<div class="tp-bannershadow tp-shadow'+C.shadow+'"></div>');A.parent().find(".tp-bannershadow").css({width:C.width})}A.waitForImages(function(){h(A,C);q(A,C);t(A,C);g(A,C);u(A,C);if(C.hideThumbs>0){i(A,C)}A.waitForImages(function(){A.find(".tp-loader").fadeOut(400);setTimeout(function(){k(A,C);s(A,C)},1000)})});c(window).resize(function(){if(A.outerWidth(true)!=C.width){w(A,C)}})})}});function w(y,z){y.find(".defaultimg").each(function(C){x(c(this),z);z.height=Math.round(z.startheight*(z.width/z.startwidth));y.height(z.height);x(c(this),z);try{y.parent().find(".tp-bannershadow").css({width:z.width})}catch(E){}var A=y.find("li:eq("+z.act+") .slotholder");var D=y.find("li:eq("+z.next+") .slotholder");l(y);D.find(".defaultimg").css({opacity:0});A.find(".defaultimg").css({opacity:1});b(y,z);var B=y.find("li:eq("+z.next+")");y.find(".caption").each(function(){c(this).stop(true,true)});o(B,z);e(z,y)})}function e(A,y){A.cd=0;var z=y.find(".tp-bannertimer");if(z.length>0){z.stop();z.css({width:"0%"});z.animate({width:"100%"},{duration:(A.delay-100),queue:false,easing:"linear"})}clearTimeout(A.thumbtimer);A.thumbtimer=setTimeout(function(){d(y);n(y,A)},200)}function r(A,y){A.cd=0;k(y,A);var z=y.find(".tp-bannertimer");if(z.length>0){z.stop();z.css({width:"0%"});z.animate({width:"100%"},{duration:(A.delay-100),queue:false,easing:"linear"})}}function t(B,E){var D=B.parent();if(E.navigationType=="thumb"||E.navsecond=="both"){D.append('<div class="tp-bullets tp-thumbs '+E.navigationStyle+'"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>')}var A=D.find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");var C=A.parent();C.width(E.thumbWidth*E.thumbAmount);C.height(E.thumbHeight);C.parent().width(E.thumbWidth*E.thumbAmount);C.parent().height(E.thumbHeight);B.find("ul:first li").each(function(I){var G=B.find("ul:first li:eq("+I+")");if(G.data("thumb")!=f){var J=G.data("thumb")}else{var J=G.find("img:first").attr("src")}A.append('<div class="bullet thumb"><img src="'+J+'"></div>');var H=A.find(".bullet:first")});A.append('<div style="clear:both"></div>');var F=1000;A.find(".bullet").each(function(G){var H=c(this);if(G==E.slideamount-1){H.addClass("last")}if(G==0){H.addClass("first")}H.width(E.thumbWidth);H.height(E.thumbHeight);if(F>H.outerWidth(true)){F=H.outerWidth(true)}H.click(function(){if(E.transition==0&&H.index()!=E.act){E.next=H.index();r(E,B)}})});var z=F*B.find("ul:first li").length;var y=A.parent().width();E.thumbWidth=F;if(y<z){c(document).mousemove(function(G){c("body").data("mousex",G.pageX)});A.parent().mouseenter(function(){var J=c(this);J.addClass("over");var I=J.offset();var N=c("body").data("mousex")-I.left;var G=J.width();var H=J.find(".bullet:first").outerWidth(true);var M=H*B.find("ul:first li").length;var O=(M-G)+15;var L=O/G;N=N-30;var K=(0-((N)*L));if(K>0){K=0}if(K<0-M+G){K=0-M+G}m(J,K,200)});A.parent().mousemove(function(){var J=c(this);var I=J.offset();var N=c("body").data("mousex")-I.left;var G=J.width();var H=J.find(".bullet:first").outerWidth(true);var M=H*B.find("ul:first li").length;var O=(M-G)+15;var L=O/G;N=N-30;var K=(0-((N)*L));if(K>0){K=0}if(K<0-M+G){K=0-M+G}m(J,K,0)});A.parent().mouseleave(function(){var G=c(this);G.removeClass("over");d(B)})}}function d(y){var z=y.parent().find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");var D=z.parent();var C=D.offset();var B=D.find(".bullet:first").outerWidth(true);var H=D.find(".bullet.selected").index()*B;var A=D.width();var B=D.find(".bullet:first").outerWidth(true);var G=B*y.find("ul:first li").length;var I=(G-A);var F=I/A;var E=0-H;if(E>0){E=0}if(E<0-G+A){E=0-G+A}if(!D.hasClass("over")){m(D,E,200)}}function m(z,A,y){z.stop();z.find(".tp-thumbcontainer").animate({left:A+"px"},{duration:y,queue:false})}function q(z,A){if(A.navigationType=="bullet"||A.navigationType=="both"){z.parent().append('<div class="tp-bullets simplebullets '+A.navigationStyle+'"></div>')}var y=z.parent().find(".tp-bullets");z.find("ul:first li").each(function(C){var D=z.find("ul:first li:eq("+C+") img:first").attr("src");y.append('<div class="bullet"></div>');var B=y.find(".bullet:first")});y.find(".bullet").each(function(B){var C=c(this);if(B==A.slideamount-1){C.addClass("last")}if(B==0){C.addClass("first")}C.click(function(){if(A.transition==0&&C.index()!=A.act){A.next=C.index();r(A,z)}})});y.append('<div style="clear:both"></div>');n(z,A);c("#unvisible_button").click(function(){A.navigationArrows=c(".select_navarrows .selected").data("value");A.navigationType=c(".select_navigationtype .selected").data("value");A.hideThumbs=c(".select_navshow .selected").data("value");z.data("hidethumbs",A.hideThumbs);var C=c(".select_bhposition .dragger");A.navOffsetHorizontal=Math.round(((C.data("max")-C.data("min"))*(C.position().left/410))+C.data("min"));var E=c(".select_bvposition .dragger");A.navOffsetVertical=Math.round(((E.data("max")-E.data("min"))*(E.position().left/410))+E.data("min"));var B=c(".select_slidetime .dragger");A.delay2=Math.round((((B.data("max")-B.data("min"))*(B.position().left/410))+B.data("min"))*1000);if(A.delay2!=A.delay){A.delay=A.delay2;A.origcd=A.delay;A.cd=0;var D=z.find(".tp-bannertimer");if(D.length>0){D.stop();D.css({width:"0%"});D.animate({width:"100%"},{duration:(A.delay-100),queue:false,easing:"linear"})}}A.onHoverStop=c(".select_hovers .selected").data("value");n(z,A);setTimeout(function(){n(z,A)},100)})}function g(z,A){var y=z.find(".tp-bullets");if(A.navigationArrow!="none"){z.parent().append('<div class="tp-leftarrow tparrows '+A.navigationStyle+'"></div>')}if(A.navigationArrow!="none"){z.parent().append('<div class="tp-rightarrow tparrows '+A.navigationStyle+'"></div>')}z.parent().find(".tp-rightarrow").click(function(){if(A.transition==0){A.next=A.next+1;if(A.next==A.slideamount){A.next=0}r(A,z)}});z.parent().find(".tp-leftarrow").click(function(){if(A.transition==0){A.next=A.next-1;if(A.next<0){A.next=A.slideamount-1}r(A,z)}});n(z,A)}function u(y,z){if(z.touchenabled=="on"){y.swipe({data:y,swipeRight:function(){if(z.transition==0){z.next=z.next-1;if(z.next<0){z.next=z.slideamount-1}r(z,y)}},swipeLeft:function(){if(z.transition==0){z.next=z.next+1;if(z.next==z.slideamount){z.next=0}r(z,y)}},allowPageScroll:"auto"})}}function i(A,B){var z=A.parent().find(".tp-bullets");var y=A.parent().find(".tparrows");if(z==null){A.append('<div class=".tp-bullets"></div>');var z=A.parent().find(".tp-bullets")}if(y==null){A.append('<div class=".tparrows"></div>');var y=A.parent().find(".tparrows")}A.data("hidethumbs",B.hideThumbs);try{z.css({opacity:0})}catch(C){}try{y.css({opacity:0})}catch(C){}z.hover(function(){z.addClass("hovered");clearTimeout(A.data("hidethumbs"));z.cssAnimate({opacity:1},{duration:200,queue:false});y.animate({opacity:1},{duration:200,queue:false})},function(){z.removeClass("hovered");if(!A.hasClass("hovered")&&!z.hasClass("hovered")){A.data("hidethumbs",setTimeout(function(){z.cssAnimate({opacity:0},{duration:200,queue:false});y.animate({opacity:0},{duration:200,queue:false})},B.hideThumbs))}});y.hover(function(){z.addClass("hovered");clearTimeout(A.data("hidethumbs"));z.cssAnimate({opacity:1},{duration:200,queue:false});y.animate({opacity:1},{duration:200,queue:false})},function(){z.removeClass("hovered");if(!A.hasClass("hovered")&&!z.hasClass("hovered")){A.data("hidethumbs",setTimeout(function(){z.cssAnimate({opacity:0},{duration:200,queue:false});y.animate({opacity:0},{duration:200,queue:false})},B.hideThumbs))}});A.on("mouseenter",function(){A.addClass("hovered");clearTimeout(A.data("hidethumbs"));z.cssAnimate({opacity:1},{duration:200,queue:false});y.animate({opacity:1},{duration:200,queue:false})});A.on("mouseleave",function(){A.removeClass("hovered");if(!A.hasClass("hovered")&&!z.hasClass("hovered")){A.data("hidethumbs",setTimeout(function(){z.cssAnimate({opacity:0},{duration:200,queue:false});y.animate({opacity:0},{duration:200,queue:false})},B.hideThumbs))}})}function n(A,C){if(C.navigationType=="both"){C.navigationType="bullet";C.navsecond="both"}if(C.navigationType=="none"&&C.navigationArrows!="none"){C.navigationArrows="verticalcentered"}C.navOH=C.navOffsetHorizontal*C.bw;C.navOV=C.navOffsetVertical*C.bh;if(C.bw!=1){C.navOH=0}var J=A.parent();var D=J.find(".tp-leftarrow");var B=J.find(".tp-rightarrow");if(C.navigationType=="bullet"){var E=J.find(".tp-bullets.simplebullets");E.css({visibility:"visible"});try{J.find(".tp-thumbs").css({visibility:"hidden"})}catch(H){}var z=E.width();if(!E.hasClass("tp-thumbs")){z=0;E.find(".bullet").each(function(){z=z+c(this).outerWidth(true)});E.css({width:(z)+"px"})}var F=J.outerWidth()-C.width;E.css({left:(C.navOH)+(F/2)+(C.width/2-z/2)+"px",bottom:C.navOV+"px"});if(C.navigationArrows=="nexttobullets"){D.removeClass("large");B.removeClass("large");D.removeClass("thumbswitharrow");B.removeClass("thumbswitharrow");D.css({visibility:"visible"});B.css({visibility:"visible"});var I=0;D.css({position:"absolute",left:(E.position().left-D.outerWidth(true))+"px",top:E.position().top+"px"});B.css({position:"absolute",left:(E.outerWidth(true)+E.position().left)+"px",top:E.position().top+"px"})}else{if(C.navigationArrows=="verticalcentered"){D.addClass("large");B.addClass("large");D.css({visibility:"visible"});B.css({visibility:"visible"});var y=J.outerHeight();D.css({position:"absolute",left:(F/2)+"px",top:(y/2)+"px"});B.css({position:"absolute",left:(C.width-B.outerWidth()+F/2)+"px",top:(y/2)+"px"})}else{D.css({visibility:"hidden"});B.css({visibility:"hidden"})}}}else{if(C.navigationType=="thumb"){var G=J.find(".tp-thumbs");try{J.find(".tp-bullets").css({visibility:"hidden"})}catch(H){}G.css({visibility:"visible"});var y=G.parent().outerHeight();var F=J.outerWidth()-C.width;G.css({left:(C.navOH)+(C.width/2-G.width()/2)+"px"});G.css({bottom:(0-G.outerHeight(true)+(C.navOV))+"px"});if(C.navigationArrows=="verticalcentered"){D.css({visibility:"visible"});B.css({visibility:"visible"});D.addClass("large");B.addClass("large");D.css({position:"absolute",left:(F/2)+"px",top:(J.outerHeight()/2)+"px"});B.css({position:"absolute",left:(C.width-B.outerWidth()+F/2)+"px",top:(J.outerHeight()/2)+"px"})}else{D.css({visibility:"hidden"});B.css({visibility:"hidden"})}}else{if(C.navigationType=="none"){try{J.find(".tp-bullets").css({visibility:"hidden"})}catch(H){}try{J.find(".tp-thumbs").css({visibility:"hidden"})}catch(H){}if(C.navigationArrows!="none"){var F=J.outerWidth()-C.width;D.css({visibility:"visible"});B.css({visibility:"visible"});D.addClass("large");B.addClass("large");D.css({position:"absolute",left:(F/2)+"px",top:(J.outerHeight()/2)+"px"});B.css({position:"absolute",left:(C.width-B.outerWidth()+F/2)+"px",top:(J.outerHeight()/2)+"px"})}else{D.css({visibility:"hidden"});B.css({visibility:"hidden"})}}}}}function x(z,B){B.width=parseInt(B.container.width(),0);B.height=parseInt(B.container.height(),0);B.bw=B.width/B.startwidth;B.bh=B.height/B.startheight;if(B.bh>1){B.bw=1;B.bh=1}if(z.data("orgw")!=f){z.width(z.data("orgw"));z.height(z.data("orgh"))}var E=B.width/z.width();var y=B.height/z.height();B.fw=E;B.fh=y;if(z.data("orgw")==f){z.data("orgw",z.width());z.data("orgh",z.height())}if(B.fullWidth=="on"){var A=B.container.parent().width();var D=B.container.parent().height();var F=D/z.data("orgh");var C=A/z.data("orgw");z.width(z.width()*F);z.height(D);if(z.width()<A){z.width(A+50);var C=z.width()/z.data("orgw");z.height(z.data("orgh")*C)}if(z.width()>A){z.data("fxof",(A/2-z.width()/2));z.css({position:"absolute",left:z.data("fxof")+"px"})}}else{z.width(B.width);z.height(z.height()*E);if(z.height()<B.height&&z.height()!=0&&z.height()!=null){z.height(B.height);z.width(z.data("orgw")*y)}}z.data("neww",z.width());z.data("newh",z.height());if(B.fullWidth=="on"){B.slotw=Math.ceil(z.width()/B.slots)}else{B.slotw=Math.ceil(B.width/B.slots)}B.sloth=Math.ceil(B.height/B.slots)}function h(y,z){y.find(".caption").each(function(){c(this).addClass(c(this).data("transition"));c(this).addClass("start")});y.find("ul:first >li").each(function(B){var A=c(this);if(A.data("link")!=f){var C=A.data("link");A.append('<div class="caption sft slidelink" data-x="0" data-y="0" data-start="0"><a href="'+C+'"><div></div></a></div>')}});y.find("ul:first li >img").each(function(B){var A=c(this);A.addClass("defaultimg");x(A,z);A.wrap('<div class="slotholder"></div>');A.css({opacity:0});A.data("li-id",B)})}function v(H,z,B){var F=H;var D=F.find("img");x(D,z);var y=D.attr("src");var I=D.data("neww");var E=D.data("newh");var G=D.data("fxof");if(G==f){G=0}var A=0;if(!B){var A=0-z.slotw}for(var C=0;C<z.slots;C++){F.append('<div class="slot" style="position:absolute;top:0px;left:'+(G+C*z.slotw)+"px;overflow:hidden;width:"+z.slotw+"px;height:"+E+'px"><div class="slotslide" style="position:absolute;top:0px;left:'+A+"px;width:"+z.slotw+"px;height:"+E+'px;overflow:hidden;"><img style="position:absolute;top:0px;left:'+(0-(C*z.slotw))+"px;width:"+I+"px;height:"+E+'px" src="'+y+'"></div></div>')}}function j(H,z,B){var F=H;var D=F.find("img");x(D,z);var y=D.attr("src");var I=D.data("neww");var E=D.data("newh");var G=D.data("fxof");if(G==f){G=0}var A=0;if(!B){var A=0-z.sloth}for(var C=0;C<z.slots;C++){F.append('<div class="slot" style="position:absolute;top:'+(C*z.sloth)+"px;left:"+(G)+"px;overflow:hidden;width:"+I+"px;height:"+(z.sloth)+'px"><div class="slotslide" style="position:absolute;top:'+A+"px;left:0px;width:"+I+"px;height:"+z.sloth+'px;overflow:hidden;"><img style="position:absolute;top:'+(0-(C*z.sloth))+"px;left:0px;width:"+I+"px;height:"+E+'px" src="'+y+'"></div></div>')}}function p(M,B,D){var I=M;var G=I.find("img");x(G,B);var A=G.attr("src");var N=G.data("neww");var H=G.data("newh");var L=G.data("fxof");if(L==f){L=0}var C=0;var z=0;if(B.sloth>B.slotw){z=B.sloth}else{z=B.slotw}if(!D){var C=0-z}B.slotw=z;B.sloth=z;var K=0;var J=0;for(var E=0;E<B.slots;E++){J=0;for(var F=0;F<B.slots;F++){I.append('<div class="slot" style="position:absolute;top:'+J+"px;left:"+(L+K)+"px;width:"+z+"px;height:"+z+'px;overflow:hidden;"><div class="slotslide" data-x="'+K+'" data-y="'+J+'" style="position:absolute;top:'+(0)+"px;left:"+(0)+"px;width:"+z+"px;height:"+z+'px;overflow:hidden;"><img style="position:absolute;top:'+(0-J)+"px;left:"+(0-K)+"px;width:"+N+"px;height:"+H+'px"src="'+A+'"></div></div>');J=J+z}K=K+z}}function l(y){y.find(".slotholder .slot").each(function(){clearTimeout(c(this).data("tout"));c(this).remove()})}function b(y,A){var C=y.find("li:eq("+A.act+")");var z=y.find("li:eq("+A.next+")");var B=z.find(".caption");if(B.find("iframe")==0){if(B.hasClass("hcenter")){B.css({height:A.height+"px",top:"0px",left:(A.width/2-B.outerWidth()/2)+"px"})}else{if(B.hasClass("vcenter")){B.css({width:A.width+"px",left:"0px",top:(A.height/2-B.outerHeight()/2)+"px"})}}}}function k(y,z){z.transition=1;var H=y.find("li:eq("+z.act+")");var F=y.find("li:eq("+z.next+")");var E=H.find(".slotholder");var D=F.find(".slotholder");H.css({visibility:"visible"});F.css({visibility:"visible"});if(c.browser.msie&&c.browser.version<9){if(F.data("transition")=="boxfade"){F.data("transition","boxslide")}if(F.data("transition")=="slotfade-vertical"){F.data("transition","slotzoom-vertical")}if(F.data("transition")=="slotfade-horizontal"){F.data("transition","slotzoom-horizontal")}}if(F.data("delay")!=f){z.cd=0;z.delay=F.data("delay")}else{z.delay=z.origcd}H.css({left:"0px",top:"0px"});F.css({left:"0px",top:"0px"});y.parent().find(".bullet").each(function(){var J=c(this);J.removeClass("selected");if(J.index()==z.next){J.addClass("selected")}});y.find("li").each(function(){var J=c(this);if(J.index!=z.act&&J.index!=z.next){J.css({"z-index":16})}});H.css({"z-index":18});F.css({"z-index":20});F.css({opacity:0});a(H,z);o(F,z);if(F.data("slotamount")==f||F.data("slotamount")<1){z.slots=Math.round(Math.random()*12+4);if(F.data("transition")=="boxslide"){z.slots=Math.round(Math.random()*6+3)}}else{z.slots=F.data("slotamount")}if(F.data("transition")=="boxslide"){if(z.slots>15){z.slots=15}F.css({opacity:1});p(E,z,true);p(D,z,false);D.find(".defaultimg").css({opacity:0});D.find(".slotslide").each(function(J){var K=c(this);K.css({top:(0-z.sloth)+"px",left:(0-z.slotw)+"px"});setTimeout(function(){if(z.firefox13){K.animate({top:"0px",left:"0px"},{duration:(400),queue:false,complete:function(){if(J==(z.slots*z.slots)-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}}})}else{K.cssAnimate({top:"0px",left:"0px"},{duration:(400),queue:false,complete:function(){if(J==(z.slots*z.slots)-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}}})}},J*15)})}if(F.data("transition")=="boxfade"){if(z.slots>15){z.slots=15}F.css({opacity:1});p(D,z,false);D.find(".defaultimg").css({opacity:0});D.find(".slotslide").each(function(J){var K=c(this);K.css({opacity:0});K.find("img").css({opacity:0});K.find("img").css({top:(Math.random()*z.slotw-z.slotw)+"px",left:(Math.random()*z.slotw-z.slotw)+"px"});var L=Math.random()*1000+500;if(J==(z.slots*z.slots)-1){L=1500}if(z.firefox13){K.find("img").animate({opacity:1,top:(0-K.data("y"))+"px",left:(0-K.data("x"))+"px"},{duration:L,queue:false});K.animate({opacity:1},{duration:L,queue:false,complete:function(){if(J==(z.slots*z.slots)-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}}})}else{K.find("img").cssAnimate({opacity:1,top:(0-K.data("y"))+"px",left:(0-K.data("x"))+"px"},{duration:L,queue:false});K.cssAnimate({opacity:1},{duration:L,queue:false,complete:function(){if(J==(z.slots*z.slots)-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}}})}})}if(F.data("transition")=="slotslide-horizontal"){F.css({opacity:1});v(E,z,true);v(D,z,false);D.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(){var J=c(this);if(z.firefox13){J.animate({left:z.slotw+"px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}})}else{J.cssAnimate({left:z.slotw+"px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}})}});D.find(".slotslide").each(function(){var J=c(this);J.css({left:(0-z.slotw)+"px"});if(z.firefox13){J.animate({left:"0px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}})}else{J.cssAnimate({left:"0px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}})}})}if(F.data("transition")=="slotslide-vertical"){F.css({opacity:1});j(E,z,true);j(D,z,false);D.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(){var J=c(this);if(z.firefox13){J.animate({top:z.sloth+"px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}})}else{J.cssAnimate({top:z.sloth+"px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}})}});D.find(".slotslide").each(function(){var J=c(this);J.css({top:(0-z.sloth)+"px"});if(z.firefox13){J.animate({top:"0px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}})}else{J.cssAnimate({top:"0px"},{duration:500,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}})}})}if(F.data("transition")=="curtain-1"){F.css({opacity:1});v(E,z,true);v(D,z,true);D.find(".defaultimg").css({opacity:0});E.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(K){var J=c(this);J.cssAnimate({top:(0+(z.height))+"px",opacity:1},{duration:300+(K*(70-z.slots)),queue:false,complete:function(){}})});D.find(".slotslide").each(function(K){var J=c(this);J.css({top:(0-(z.height))+"px",opacity:0});if(z.firefox13){J.animate({top:"0px",opacity:1},{duration:300+(K*(70-z.slots)),queue:false,complete:function(){if(K==z.slots-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}}})}else{J.cssAnimate({top:"0px",opacity:1},{duration:300+(K*(70-z.slots)),queue:false,complete:function(){if(K==z.slots-1){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}}})}})}if(F.data("transition")=="curtain-2"){F.css({opacity:1});v(E,z,true);v(D,z,true);D.find(".defaultimg").css({opacity:0});E.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(K){var J=c(this);if(z.firefox13){J.animate({top:(0+(z.height))+"px",opacity:1},{duration:300+((z.slots-K)*(70-z.slots)),queue:false,complete:function(){}})}else{J.cssAnimate({top:(0+(z.height))+"px",opacity:1},{duration:300+((z.slots-K)*(70-z.slots)),queue:false,complete:function(){}})}});D.find(".slotslide").each(function(K){var J=c(this);J.css({top:(0-(z.height))+"px",opacity:0});if(z.firefox13){J.animate({top:"0px",opacity:1},{duration:300+((z.slots-K)*(70-z.slots)),queue:false,complete:function(){if(K==0){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}}})}else{J.cssAnimate({top:"0px",opacity:1},{duration:300+((z.slots-K)*(70-z.slots)),queue:false,complete:function(){if(K==0){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}}})}})}if(F.data("transition")=="curtain-3"){F.css({opacity:1});if(z.slots<2){z.slots=2}v(E,z,true);v(D,z,true);D.find(".defaultimg").css({opacity:0});E.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(L){var K=c(this);if(L<z.slots/2){var J=(L+2)*60}else{var J=(2+z.slots-L)*60}if(z.firefox13){K.animate({top:(0+(z.height))+"px",opacity:1},{duration:300+J,queue:false,complete:function(){}})}else{K.cssAnimate({top:(0+(z.height))+"px",opacity:1},{duration:300+J,queue:false,complete:function(){}})}});D.find(".slotslide").each(function(L){var K=c(this);K.css({top:(0-(z.height))+"px",opacity:0});if(L<z.slots/2){var J=(L+2)*60}else{var J=(2+z.slots-L)*60}if(z.firefox13){K.animate({top:"0px",opacity:1},{duration:300+J,queue:false,complete:function(){if(L==Math.round(z.slots/2)){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.act=z.next;z.transition=0;d(y)}}})}else{K.cssAnimate({top:"0px",opacity:1},{duration:300+J,queue:false,complete:function(){if(L==Math.round(z.slots/2)){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.act=z.next;z.transition=0;d(y)}}})}})}if(F.data("transition")=="slotzoom-horizontal"){F.css({opacity:1});v(E,z,true);v(D,z,true);D.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(){var J=c(this).find("img");if(z.firefox13){J.animate({left:(0-z.slotw/2)+"px",top:(0-z.height/2)+"px",width:(z.slotw*2)+"px",height:(z.height*2)+"px",opacity:0},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.transition=0;z.act=z.next;d(y)}})}else{J.cssAnimate({left:(0-z.slotw/2)+"px",top:(0-z.height/2)+"px",width:(z.slotw*2)+"px",height:(z.height*2)+"px",opacity:0},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.transition=0;z.act=z.next;d(y)}})}});D.find(".slotslide").each(function(K){var J=c(this).find("img");J.css({left:(0)+"px",top:(0)+"px",opacity:0});if(z.firefox13){J.animate({left:(0-K*z.slotw)+"px",top:(0)+"px",width:(D.find(".defaultimg").data("neww"))+"px",height:(D.find(".defaultimg").data("newh"))+"px",opacity:1},{duration:1000,queue:false})}else{J.cssAnimate({left:(0-K*z.slotw)+"px",top:(0)+"px",width:(D.find(".defaultimg").data("neww"))+"px",height:(D.find(".defaultimg").data("newh"))+"px",opacity:1},{duration:1000,queue:false})}})}if(F.data("transition")=="slotzoom-vertical"){F.css({opacity:1});j(E,z,true);j(D,z,true);D.find(".defaultimg").css({opacity:0});E.find(".slotslide").each(function(){var J=c(this).find("img");if(z.firefox13){J.animate({left:(0-z.width/2)+"px",top:(0-z.sloth/2)+"px",width:(z.width*2)+"px",height:(z.sloth*2)+"px",opacity:0},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.transition=0;z.act=z.next;d(y)}})}else{J.cssAnimate({left:(0-z.width/2)+"px",top:(0-z.sloth/2)+"px",width:(z.width*2)+"px",height:(z.sloth*2)+"px",opacity:0},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.transition=0;z.act=z.next;d(y)}})}});D.find(".slotslide").each(function(K){var J=c(this).find("img");J.css({left:(0)+"px",top:(0)+"px",opacity:0});if(z.firefox13){J.animate({left:(0)+"px",top:(0-K*z.sloth)+"px",width:(D.find(".defaultimg").data("neww"))+"px",height:(D.find(".defaultimg").data("newh"))+"px",opacity:1},{duration:1000,queue:false})}else{J.cssAnimate({left:(0)+"px",top:(0-K*z.sloth)+"px",width:(D.find(".defaultimg").data("neww"))+"px",height:(D.find(".defaultimg").data("newh"))+"px",opacity:1},{duration:1000,queue:false})}})}if(F.data("transition")=="slotfade-horizontal"){F.css({opacity:1});z.slots=z.width/20;v(D,z,true);D.find(".defaultimg").css({opacity:0});var B=0;D.find(".slotslide").each(function(K){var J=c(this);B++;J.css({opacity:0});J.data("tout",setTimeout(function(){J.animate({opacity:1},{duration:300,queue:false})},K*4))});setTimeout(function(){z.transition=0;z.act=z.next;d(y)},(300+(B*4)))}if(F.data("transition")=="slotfade-vertical"){F.css({opacity:1});z.slots=z.height/20;j(D,z,true);D.find(".defaultimg").css({opacity:0});var B=0;D.find(".slotslide").each(function(K){var J=c(this);B++;J.css({opacity:0});J.data("tout",setTimeout(function(){J.animate({opacity:1},{duration:300,queue:false})},K*4))});setTimeout(function(){z.transition=0;z.act=z.next;d(y)},(300+(B*4)))}if(F.data("transition")=="fade"){F.css({opacity:1});z.slots=1;v(D,z,true);D.find(".defaultimg").css({opacity:0});var B=0;D.find(".slotslide").each(function(K){var J=c(this);B++;J.css({opacity:0});J.animate({opacity:1},{duration:300,queue:false})});setTimeout(function(){z.transition=0;z.act=z.next;d(y)},300)}if(F.data("transition")=="slideleft"||F.data("transition")=="slideup"||F.data("transition")=="slidedown"||F.data("transition")=="slideright"){F.css({opacity:1});z.slots=1;v(D,z,true);v(E,z,true);E.find(".defaultimg").css({opacity:0});D.find(".defaultimg").css({opacity:0});var C=z.width;var I=z.height;if(z.fullWidth=="on"){C=z.container.parent().width();I=z.container.parent().height()}var A=D.find(".slotslide");if(F.data("transition")=="slideleft"){A.css({left:C+"px"})}else{if(F.data("transition")=="slideright"){A.css({left:(0-z.width)+"px"})}else{if(F.data("transition")=="slideup"){A.css({top:(I)+"px"})}else{if(F.data("transition")=="slidedown"){A.css({top:(0-z.height)+"px"})}}}}if(z.firefox13){A.animate({left:"0px",top:"0px",opacity:1},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});z.transition=0;z.act=z.next;d(y)}})}else{A.cssAnimate({left:"0px",top:"0px",opacity:1},{duration:1000,queue:false,complete:function(){l(y);D.find(".defaultimg").css({opacity:1});E.find(".defaultimg").css({opacity:0});if(c.browser.msie&&c.browser.version<9){E.find(".defaultimg").css({opacity:1})}z.transition=0;z.act=z.next;d(y)}})}var G=E.find(".slotslide");if(z.firefox13){if(F.data("transition")=="slideleft"){G.animate({left:(0-C)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slideright"){G.animate({left:(C)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slideup"){G.animate({top:(0-I)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slidedown"){G.animate({top:(I)+"px",opacity:1},{duration:1000,queue:false})}}}}}else{if(F.data("transition")=="slideleft"){G.cssAnimate({left:(0-C)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slideright"){G.cssAnimate({left:(C)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slideup"){G.cssAnimate({top:(0-I)+"px",opacity:1},{duration:1000,queue:false})}else{if(F.data("transition")=="slidedown"){G.cssAnimate({top:(I)+"px",opacity:1},{duration:1000,queue:false})}}}}}}}function a(z,y){z.find(".caption").each(function(B){var I=z.find(".caption:eq("+B+")");I.stop(true,true);clearTimeout(I.data("timer"));var F=I.data("easing");F="easeInOutSine";var H=I.data("repx");var E=I.data("repy");var C=I.data("repo");if(I.find("iframe").length>0){var G=I.find("iframe").parent();var A=G.html();setTimeout(function(){I.find("iframe").remove();G.append(A)},I.data("speed"))}try{I.animate({opacity:C,left:H+"px",top:E+"px"},{duration:I.data("speed"),easing:F})}catch(D){}})}function o(z,y){z.find(".caption").each(function(E){offsetx=y.width/2-y.startwidth/2;if(y.bh>1){y.bw=1;y.bh=1}var I=y.bw;var H=z.find(".caption:eq("+E+")");H.stop(true,true);if(H.hasClass("coloredbg")){offsetx=0}if(offsetx<0){offsetx=0}clearTimeout(H.data("timer"));var F=0;var B=0;if(H.find("img").length>0){var G=H.find("img");if(G.data("ww")==f){G.data("ww",G.width())}if(G.data("hh")==f){G.data("hh",G.height())}var D=G.data("ww");var A=G.data("hh");G.width(D*y.bw);G.height(A*y.bh);F=G.width();B=G.height()}else{if(H.find("iframe").length>0){var G=H.find("iframe");if(H.data("ww")==f){H.data("ww",G.width())}if(H.data("hh")==f){H.data("hh",G.height())}var D=H.data("ww");var A=H.data("hh");var C=H;if(C.data("fsize")==f){C.data("fsize",parseInt(C.css("font-size"),0)||0)}if(C.data("pt")==f){C.data("pt",parseInt(C.css("paddingTop"),0)||0)}if(C.data("pb")==f){C.data("pb",parseInt(C.css("paddingBottom"),0)||0)}if(C.data("pl")==f){C.data("pl",parseInt(C.css("paddingLeft"),0)||0)}if(C.data("pr")==f){C.data("pr",parseInt(C.css("paddingRight"),0)||0)}if(C.data("mt")==f){C.data("mt",parseInt(C.css("marginTop"),0)||0)}if(C.data("mb")==f){C.data("mb",parseInt(C.css("marginBottom"),0)||0)}if(C.data("ml")==f){C.data("ml",parseInt(C.css("marginLeft"),0)||0)}if(C.data("mr")==f){C.data("mr",parseInt(C.css("marginRight"),0)||0)}if(C.data("bt")==f){C.data("bt",parseInt(C.css("borderTop"),0)||0)}if(C.data("bb")==f){C.data("bb",parseInt(C.css("borderBottom"),0)||0)}if(C.data("bl")==f){C.data("bl",parseInt(C.css("borderLeft"),0)||0)}if(C.data("br")==f){C.data("br",parseInt(C.css("borderRight"),0)||0)}if(C.data("lh")==f){C.data("lh",parseInt(C.css("lineHeight"),0)||0)}H.css({"font-size":(C.data("fsize")*y.bw)+"px","padding-top":(C.data("pt")*y.bh)+"px","padding-bottom":(C.data("pb")*y.bh)+"px","padding-left":(C.data("pl")*y.bw)+"px","padding-right":(C.data("pr")*y.bw)+"px","margin-top":(C.data("mt")*y.bh)+"px","margin-bottom":(C.data("mb")*y.bh)+"px","margin-left":(C.data("ml")*y.bw)+"px","margin-right":(C.data("mr")*y.bw)+"px","border-top":(C.data("bt")*y.bh)+"px","border-bottom":(C.data("bb")*y.bh)+"px","border-left":(C.data("bl")*y.bw)+"px","border-right":(C.data("br")*y.bw)+"px","line-height":(C.data("lh")*y.bh)+"px",height:(A*y.bh)+"px","white-space":"nowrap"});G.width(D*y.bw);G.height(A*y.bh);F=G.width();B=G.height()}else{var C=H;if(C.data("fsize")==f){C.data("fsize",parseInt(C.css("font-size"),0)||0)}if(C.data("pt")==f){C.data("pt",parseInt(C.css("paddingTop"),0)||0)}if(C.data("pb")==f){C.data("pb",parseInt(C.css("paddingBottom"),0)||0)}if(C.data("pl")==f){C.data("pl",parseInt(C.css("paddingLeft"),0)||0)}if(C.data("pr")==f){C.data("pr",parseInt(C.css("paddingRight"),0)||0)}if(C.data("mt")==f){C.data("mt",parseInt(C.css("marginTop"),0)||0)}if(C.data("mb")==f){C.data("mb",parseInt(C.css("marginBottom"),0)||0)}if(C.data("ml")==f){C.data("ml",parseInt(C.css("marginLeft"),0)||0)}if(C.data("mr")==f){C.data("mr",parseInt(C.css("marginRight"),0)||0)}if(C.data("bt")==f){C.data("bt",parseInt(C.css("borderTop"),0)||0)}if(C.data("bb")==f){C.data("bb",parseInt(C.css("borderBottom"),0)||0)}if(C.data("bl")==f){C.data("bl",parseInt(C.css("borderLeft"),0)||0)}if(C.data("br")==f){C.data("br",parseInt(C.css("borderRight"),0)||0)}if(C.data("lh")==f){C.data("lh",parseInt(C.css("lineHeight"),0)||0)}H.css({"font-size":(C.data("fsize")*y.bw)+"px","padding-top":(C.data("pt")*y.bh)+"px","padding-bottom":(C.data("pb")*y.bh)+"px","padding-left":(C.data("pl")*y.bw)+"px","padding-right":(C.data("pr")*y.bw)+"px","margin-top":(C.data("mt")*y.bh)+"px","margin-bottom":(C.data("mb")*y.bh)+"px","margin-left":(C.data("ml")*y.bw)+"px","margin-right":(C.data("mr")*y.bw)+"px","border-top":(C.data("bt")*y.bh)+"px","border-bottom":(C.data("bb")*y.bh)+"px","border-left":(C.data("bl")*y.bw)+"px","border-right":(C.data("br")*y.bw)+"px","line-height":(C.data("lh")*y.bh)+"px","white-space":"nowrap"});B=H.outerHeight(true);F=H.outerWidth(true)}}if(H.hasClass("fade")){H.css({opacity:0,left:(I*H.data("x")+offsetx)+"px",top:(y.bh*H.data("y"))+"px"})}if(H.hasClass("lfr")){H.css({opacity:1,left:(5+y.width)+"px",top:(y.bh*H.data("y"))+"px"})}if(H.hasClass("lfl")){H.css({opacity:1,left:(-5-F)+"px",top:(y.bh*H.data("y"))+"px"})}if(H.hasClass("sfl")){H.css({opacity:0,left:((I*H.data("x"))-50+offsetx)+"px",top:(y.bh*H.data("y"))+"px"})}if(H.hasClass("sfr")){H.css({opacity:0,left:((I*H.data("x"))+50+offsetx)+"px",top:(y.bh*H.data("y"))+"px"})}if(H.hasClass("lft")){H.css({opacity:1,left:(I*H.data("x")+offsetx)+"px",top:(-5-B)+"px"})}if(H.hasClass("lfb")){H.css({opacity:1,left:(I*H.data("x")+offsetx)+"px",top:(5+y.height)+"px"})}if(H.hasClass("sft")){H.css({opacity:0,left:(I*H.data("x")+offsetx)+"px",top:((y.bh*H.data("y"))-50)+"px"})}if(H.hasClass("sfb")){H.css({opacity:0,left:(I*H.data("x")+offsetx)+"px",top:((y.bh*H.data("y"))+50)+"px"})}H.data("timer",setTimeout(function(){if(H.hasClass("fade")){H.animate({opacity:1})}if(H.hasClass("lfr")||H.hasClass("lfl")||H.hasClass("sfr")||H.hasClass("sfl")||H.hasClass("lft")||H.hasClass("lfb")||H.hasClass("sft")||H.hasClass("sfb")){var J=H.data("easing");if(J==f){J="linear"}H.data("repx",H.position().left);H.data("repy",H.position().top);H.data("repo",H.css("opacity"));H.animate({opacity:1,left:(I*H.data("x")+offsetx)+"px",top:y.bh*(H.data("y"))+"px"},{duration:H.data("speed"),easing:J})}},H.data("start")))})}function s(y,A){A.cd=0;var z=y.find(".tp-bannertimer");if(z.length>0){z.css({width:"0%"});z.animate({width:"100%"},{duration:(A.delay-100),queue:false,easing:"linear"})}A.cdint=setInterval(function(){if(A.conthover!=1){A.cd=A.cd+100}if(A.cd>=A.delay){A.cd=0;A.act=A.next;A.next=A.next+1;if(A.next>y.find(">ul >li").length-1){A.next=0}k(y,A);if(z.length>0){z.css({width:"0%"});z.animate({width:"100%"},{duration:(A.delay-100),queue:false,easing:"linear"})}}},100);y.hover(function(){if(A.onHoverStop=="on"){A.conthover=1;z.stop()}},function(){if(A.onHoverStop=="on"){A.conthover=0;z.animate({width:"100%"},{duration:((A.delay-A.cd)-100),queue:false,easing:"linear"})}})}})(jQuery);