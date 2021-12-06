var $PotientialClientModal = $('#PotentialClientFileUpload')
var $PotentialClientFileUpload = $('#PoteintialClientFileInput')

function ClosePotentialClientModal() {
    $PotientialClientModal.modal('hide');
   
    $PotentialClientFileUpload.wrap('<form>').closest(
        'form').get(0).reset();
    $PotentialClientFileUpload.unwrap();
}


$PotentialClientFileUpload.change(function (e) {
    var files = e.target.files;
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
            }

            $.ajax({
                type: "POST",
                url: '/Client/UploadPotentialClientFile',
                contentType: false,
                processData: false,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res) {
                        AppendColumnsLists(res.databaseColumns, true)
                        if (res.filecolumns.length > 0) {
                            AppendColumnsLists(res.filecolumns, false)
                        }
                      
                    }
                    $PotientialClientModal.modal('show');
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }


})

function AppendColumnsLists(result,isdatabaseField) {

    if (isdatabaseField) {
        var html = '<ul id="DatabaseFields" class="sortableListBox">'
        for (let i = 0; i < result.length; i++) {
            if (result[i].ColType == 'int' || result[i].ColType == 'bit') {
                html += `<li>${result[i].ColName} ( ${result[i].ColType == "bit" ? "Boolean" : "Interger"})</li>`
            } else {
                html += `<li>${result[i].ColName} (String( ${result[i].ColLength == -1 ? "max" : result[i].ColLength}))</li>`
            }
        }
        html += '</ul>'
        $PotientialClientModal.find('.modal-body .getDatabaseField').html(html);
    } else {

        var html = '<ul id="FileFields" class="sortableListBox">'
        for (let i = 0; i < result.length; i++) {
                html += `<li>${result[i]}</li>`
        }
        html += '</ul>'
        $PotientialClientModal.find('.modal-body .getFileFields').html(html);
    }
    
       
   
   
}


