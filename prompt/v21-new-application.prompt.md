# Context
`libs\ecsas\feature-procedure\src\lib\pages\detail-procedure\application-table` component have a feature which export applications in excel format I convert excel to csv here is the file `prompt\liste_des_demandes.csv`.

# Instruction
- add a new feature to create applications from an excel file whith the same format of exported one.

- add a preview on a modal of extracted information from excel file
- let the user check applications that will be added unchecked will be ignored
- add an indication of each row to let user know if import is safe for this line or if there is merge conflict or any other problem
- Here is updates for application-import-preview:
  1. Display only icone for column `Vérification` message should be a tooltip or title which can be seen only on icon hover
  2. add excel missing column: `Telephone`, `Adress`, `Date de naissance`
  3. applicant description (`Nouveau demandeur`, `Demandeur existant`) should be a tag like in application-table status column whith values: `nouveau` or `existant`
