# Fix P2P
1. Nothing happen when I click on the send button of the MOBILE_PAGE html page. I inspect log no request were made like event handle is not catching the event. ✅(fixed)

2. `libs\ecsas\feature-procedure\src\lib\pages\new-application\new-application.component.ts`: Submit application with tranfert file from mobile is not working. The problem is `validDocument` method which do not find required document. Here is my proposition to fix it new application component by adding a feature to let user visualize transferted files and match them with the procedure document.  ✅(fixed)

3. After submission the user should know the content of the document whithout opening it to acheive this we should use a filename that match procedure document name you can add a suffix in the filename but procedure document name should be here to help the user. My suggestion is to fix the transfert file when doing matching but feel free to adopt the solution you think is the best. ✅(fixed)
