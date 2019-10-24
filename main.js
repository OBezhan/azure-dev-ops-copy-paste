VSS.ready(function(){
    VSS.require(["TFS/WorkItemTracking/Services"], function (_WorkItemServices) {
        function getWorkItemFormService()
        {
            return _WorkItemServices.WorkItemFormService.getService();
        }
    
        VSS.register("helloflex-copyId-work-item-menu", function (context) {
            return (function () {
                "use strict";
                return {
                    execute: function (actionContext) {            
                        if (actionContext.hasOwnProperty('workItemId')) {
                            var ids = actionContext.workItemId;
                        }
                        else if (actionContext.hasOwnProperty('workItemIds')) {
                            var ids = actionContext.workItemIds.join();
                        }
                        else if (actionContext.hasOwnProperty('id')) {
                            var ids = actionContext.id;
                        }
                        function copyTextToClipboard(text){
                            var textArea = document.createElement("textarea");
                
                            textArea.style.position = 'fixed';
                            textArea.style.top = 0;
                            textArea.style.left = 0;
                            textArea.style.width = '2em';
                            textArea.style.height = '2em';
                            textArea.style.padding = 0;
                            textArea.style.border = 'none';
                            textArea.style.outline = 'none';
                            textArea.style.boxShadow = 'none';
                            textArea.style.background = 'transparent';
                
                            textArea.value = text;
                            document.body.appendChild(textArea);
                            textArea.select();
                
                            function copyToClipboardFallback(text){
                                window.prompt("To Copy: Ctrl+C, Enter", text);
                            }
    
                            try {
                                var successful = document.execCommand('copy');
                                var msg = successful ? 'successful' : 'unsuccessful';
                                console.log('Copying text command was ' + msg);
                                if (!successful) {
                                    copyToClipboardFallback(text);
                                }
                            } catch (err) {
                                console.log('Oops, unable to copy');
                                copyToClipboardFallback(text);
                            }
                
                            document.body.removeChild(textArea);
                        }
    
                        getWorkItemFormService().then(function(service){
                            service.getFieldValues(["System.Title"]).then(
                                function (value) {
                                    var title = value["System.Title"];
                                    var commitTitle = '#'+ids+' - ' + title;
                                    console.log(ids);
                                    console.log(commitTitle);
                                    console.log(title);
                                    copyTextToClipboard(commitTitle);
                                });
                        });
                    }
                };
            } ());
        });

        VSS.notifyLoadSucceeded();
    });
});


