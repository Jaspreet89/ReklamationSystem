!function(){"use strict";angular.module("RefundSystemApp").controller("UploaderCntrl",["$scope","FileUploader","$stateParams","$state","$auth",function(e,n,o,t,r){e.Back=function(){Back(t)};var a=e.uploader=new n({url:configuration.path+"/Communication/File/Upload/"+o.casedId+"?token="+r.getToken()});a.filters.push({name:"imageFilter",fn:function(e,n){var o="|"+e.type.slice(e.type.lastIndexOf("/")+1)+"|";return"|jpg|png|jpeg|bmp|gif|".indexOf(o)!==-1}}),a.onSuccessItem=function(e,n,o,t){a.removeFromQueue(e)},a.onErrorItem=function(e,n,o,t){console.info("onErrorItem",e,n,o,t)}}])}();