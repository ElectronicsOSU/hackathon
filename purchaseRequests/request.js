/* The script is deployed as a web app and renders the form */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('purchaseRequest.html');
}

/* This function will process the submitted form */
function uploadFiles(form) {

  try {

    /* Name of the Drive folder where the files should be saved */
    var dropbox = "Event Planning/Hackathon/Purchase Requests";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    /* Find the folder, create if the folder does not exist */
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    /* Get the file uploaded though the form as a blob */
    var blob = form.myFile;
    var file = folder.createFile(blob);
    var sheet = SpreadsheetApp.openById('1j34J2Uv8gvx27I7DVvSvu7KzhZUF9LsGkq2c3mLrr1U');

    /* Input data into spreadsheet */
    var data = [form.requestorName,
                form.requestorEmail,
                form.task,
                form.budgetNameExisting,
                form.purpose,
                form.desireDate,
                form.requireDate,
                form.total,
                file.getName()];
    sheet.appendRow(data);

    /* Set the file description as the name of the uploader */
    file.setDescription("Uploaded by " + form.requestorName);

    /* Email a link to the Doc as well as a PDF copy. */
    MailApp.sendEmail({
      to: "electronicsosu@gmail.com",
      subject: 'ACTION: Purchase Request: ' + file.getName() + ' has been filed',
      body: 'The following purchase request has been filed: ' + file.getUrl(),
      attachments: file.getAs(MimeType.PDF),
    });

    /* The request has been filed successfully */
    return "Request uploaded successfully.";

  } catch (error) {

    /* If there's an error, show the error message */
    return error.toString();
  }

}
