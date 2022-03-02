var $EmailAddress = $('#emailAddress');
var $DisplayName = $('#displayName')
var $Password = $('#password')
var $Port = $('#Port')
var $ServerName = $('#ServerName')
var $EmailCreds = $('#EmailCredsId')
var $SaveEmailCredsBtn = $('#SaveEmailCredsBtn')
var $OpenEye = $('.passwordDivIcons .open-eye')
var $CloseEye = $('.passwordDivIcons .close-eye');
var $SharedFormScheduler = $('#SharedFormSchedulerbtn')
var $Frequency = $('#frequency');
var $SendReminderSwitch = $('#sendReminderSwitch');

var $SharedFormExpiryAfter = $('#fsexpirationDate');
var $FsTimeUnit = $('#fsTimeUnit')

$('#emailAddress,#displayName,#password,#Port,#ServerName').on('input', function () {
    $SaveEmailCredsBtn.removeClass('disabled').prop('disabled',false)
})

$Frequency.on('input', function () {
    $SharedFormScheduler.removeClass('disabled').prop('disabled', false)
})

$SendReminderSwitch.change(function () {
    $SharedFormScheduler.removeClass('disabled').prop('disabled', false)
})
$FsTimeUnit.change(function () {
    $SharedFormScheduler.removeClass('disabled').prop('disabled', false)
})

$SharedFormExpiryAfter.on('input', function () {
    $SharedFormScheduler.removeClass('disabled').prop('disabled', false)
})


function ValidateEmailCredsForm() {
    var isValid = true;

    if ($EmailAddress.val().trim() == '') {
        toastr.error("Email address is required.");
        isValid = false;
    } else if (!ValidateEmail()) {
        toastr.error("Email address is invalid.");
        isValid = false;

    } else if ($DisplayName.val().trim() == '') {
        toastr.error("Display Name is required.");
        isValid = false;

    } else if ($Password.val().trim() == '') {
        toastr.error("Password is required.");
        isValid = false;

    } else if ($Port.val().trim() == '' || $Port.val().trim() == '0') {
        if ($Port.val().trim() == '')
            toastr.error("Port is required.");
        else
            toastr.error("Port should be more than zero.");

        isValid = false;

    }

    return isValid;

}

function ValidateEmail() {

    return String($EmailAddress.val().trim())
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function HidePassword() {
    $Password.attr('type', 'password');
    $OpenEye.hide();
    $CloseEye.show()

}
function ShowPassword() {
    $Password.attr('type', 'textbox');
    $CloseEye.hide()
    $OpenEye.show();
}

function DisableSaveBtn() {
    $SaveEmailCredsBtn.addClass('disabled')
}

function EnableSaveBtn() {
    $SaveEmailCredsBtn.removeClass('disabled')
}

function SaveOrUpdateEmailCreds(id=0) {

    if (!ValidateEmailCredsForm()) {
        return;
    }

    var model = {
        EmailAddress: $EmailAddress.val().trim(),
        Port: $Port.val().trim(),
        ServerName: $ServerName.val().trim(),
        Password: $Password.val().trim(),
        CreatedBy: _userID,
        ModifiedBy: _userID,
        Id: id,
        DisplayName: $DisplayName.val().trim()
    }

    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveorupdateemailcreds',
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            _Loader.StartLoader()
        },
        success: function (result) {
            if (result != 0) {
                UpdateSaveButton(result)
            }

           
        },
        complete: function () {
            if (id == 0) {
                toastr.success("Email credential saved successfully.");
            } else {
                toastr.success("Email credential updated successfully.");
            }
            _Loader.StopLoader()
        },
        error: function (err) {
            _Loader.StopLoader()
            toastr.error("Unexpected error!");
        }
    });

}

var emailCredsLoaded=false
function GetEmailCreds() {

    if (emailCredsLoaded) {
        return;
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getemailcreds',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        beforeSend: function () {
            _Loader.StartLoader() 
        },
        async: true,
        success: function (result) {

            if (result != null) {
                $EmailAddress.val(result.Emailid);
                $DisplayName.val(result.DisplayName);
                $Password.val(result.Password);
                $Port.val(result.Port)
                $ServerName.val(result.ServerName)
                $EmailCreds.val(result.Id)
                UpdateSaveButton(result.Id)
            }

        },
        complete: function () {
            _Loader.StopLoader()
            emailCredsLoaded = true;

        },
             error: function (e) {
                 _Loader.StopLoader()
            toastr.error("Unexpected error!");
          
        }
    });

}


function UpdateSaveButton(id) {
    $SaveEmailCredsBtn.attr('onclick', 'SaveOrUpdateEmailCreds(' + id + ')').text('Update').addClass('disabled').prop('disabled', true)

}

var isFrequencyLoaded=false
function GetSharedFormFrequency() {
    if (isFrequencyLoaded) {
        return;
    }

    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getsharedformdefaultsetting',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        beforeSend: function () {
            _Loader.StartLoader()
        },
        async: true,
        success: function (result) {

            if (result.ID != null) {
                $Frequency.val(result.Frequency)
                if (result.TurnON) {
                    $SendReminderSwitch.prop('checked',true)
                } else {
                    $SendReminderSwitch.prop('checked', false)
                }
                UpdateFrequencybtn(result.ID)
            }

            $SharedFormExpiryAfter.val(result.ExpireAfter);
            $FsTimeUnit.val(result.TimeUnit)
        },
        complete: function () {
            _Loader.StopLoader()
            isFrequencyLoaded = true;

        },
        error: function (e) {
            _Loader.StopLoader()
            toastr.error("Unexpected error!");

        }
    });

} 

function UpdateFrequencybtn(id) {
    $SharedFormScheduler.attr('onclick', 'SaveOrUpdateSchedulerFrequency(' + id + ')').text('Update').addClass('disabled').prop('disabled', true)
}

function SaveOrUpdateSchedulerFrequency(id = 0) {
    var frequency = $Frequency.val();
    var isSendReminderTurnedOn = $SendReminderSwitch.is(":checked")
    if (frequency == null || frequency == 0) {
        if (frequency == null || frequency == '')
            toastr.error("Form intake reminder frequency in days is required.");
        else
            toastr.error("Form intake reminder frequency in days should be more than zero.");

        return;
    }


    var expiryAfter = $SharedFormExpiryAfter.val().trim();
    var timeUnit = $FsTimeUnit.val();
    
    if (expiryAfter == 0 || expiryAfter == '') {
        toastr.error("Expiration date is required.");
    }

    

    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveorupdateshareddefaultsetting?id=' + id + '&frequency=' + frequency
            + '&isSendReminderTurnedOn=' + isSendReminderTurnedOn + '&expiryAfter=' + expiryAfter + '&timeUnit=' + timeUnit,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            _Loader.StartLoader()
        },
        success: function (result) {
            
            if (result != 0) {
                UpdateFrequencybtn(result)
            }
        },
        complete: function () {
            if (id == 0) {
                toastr.success("Form intake reminder frequency saved successfully.");
            } else {
                toastr.success("Form intake reminder frequency updated successfully.");
            }
            _Loader.StopLoader()
        },
        error: function (err) {
            _Loader.StopLoader()
            toastr.error("Unexpected error!");
        }
    });




}




