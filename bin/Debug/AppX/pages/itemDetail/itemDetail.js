(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    function Location() {
        return {
            name: "boo",
            address_1: "123 Sesame St",
            phone: "352-216-2160"
        }
    }

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        _items: null,


        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".basicListView").winControl;
            var item = options.item ? options.item : {};

            this._items = new WinJS.Binding.List(item.data.locations);
                        
            var publicMembers =
               {
                   itemList: this._items
               };

            function redeemDeal() {
                function checkStatus() {
                    var url = 'https://www.giftcertificatesandmore.com/api/v1/deal/status/?id=' + item.id;

                    $.ajax({
                        url: url,
                        method: 'GET',
                        beforeSend: function (req) {
                            var auth = makeAuth();
                            req.setRequestHeader('Authorization', auth);
                        },
                        success: function (status) {
                            if(status.data.redeemable && !status.data.has_redeemed)
                                printDeal();  //mark as printed
                        },
                        error: function () {
                            var confirmRedemptionMsg = "This deal is not currently redeemable.  Either you have already used this deal for this month or the offer has expired.";
                            var confirmRedemptionTitle = "Error";

                            var msg = new Windows.UI.Popups.MessageDialog(confirmRedemptionMsg, confirmRedemptionTitle);
                            msg.commands.append(new Windows.UI.Popups.UICommand("Ok!"));
                            msg.showAsync();
                        }
                    });
                }

                function printDeal() {
                    var url = 'https://www.giftcertificatesandmore.com/api/v1/deal/print/?id=' + item.id;

                    $.ajax({
                        url: url,
                        method: 'GET',
                        beforeSend: function (req) {
                            var auth = makeAuth();
                            req.setRequestHeader('Authorization', auth);
                        },
                        success: function () {
                            var confirmRedemptionMsg = "Are you sure you want to use this deal now?  You should do this in front of an employee of the business wo they know you are using it.  If you're not ready to use this deal, tap 'Cancel' so you don't waste it.";
                            var confirmRedemptionTitle = "Confirm Deal Redemption";

                            var msg = new Windows.UI.Popups.MessageDialog(confirmRedemptionMsg, confirmRedemptionTitle);
                            msg.commands.append(new Windows.UI.Popups.UICommand("Redeem!", redeemDeal));
                            msg.commands.append(new Windows.UI.Popups.UICommand("Cancel"));
                            msg.showAsync();
                        },
                        error: function () {
                            //do this
                        }
                    });
                }

                function redeemDeal() {
                    var url = 'https://www.giftcertificatesandmore.com/api/v1/deal/redeem/?id=' + item.id;

                    $.ajax({
                        url: url,
                        method: 'GET',
                        beforeSend: function (req) {
                            var auth = makeAuth();
                            req.setRequestHeader('Authorization', auth);
                        },
                        success: function (e) {
                            if (e.status === "error") {
                                var errorMsg = e.error.message;
                                var msg = new Windows.UI.Popups.MessageDialog(errorMsg);
                                msg.showAsync();
                            } else if (e.status === "success") {
                                var successMsg = "Redeemed: " + (new Date(e.data.redemption_time).toDateString()) + " | Redemption Code: " + e.data.redemption_code;
                                var msg = new Windows.UI.Popups.MessageDialog(successMsg);
                                msg.showAsync();
                            }
                            //do this
                        },
                        error: function () {
                            //do this
                        }
                    });
                }

                // login
                var url = 'https://www.giftcertificatesandmore.com/api/v1/user/login/';
                $.ajax({
                    url: url,
                    method: 'GET',
                    beforeSend: function (req) {
                        var auth = makeAuth();
                        req.setRequestHeader('Authorization', auth);
                    },
                    success: function () {
                        checkStatus(); //do this
                    },
                    error: function () {
                        var invalidAccountMsg = "Gift Certificates & More is a service and requires a valid account to gain access to these awesome deals.  Visit our website to sign up!";
                        var invalidAccountTitle = "Invalid Username or Password";

                        var msg = new Windows.UI.Popups.MessageDialog(invalidAccountMsg, invalidAccountTitle);
                        msg.commands.append(new Windows.UI.Popups.UICommand("Learn More!", function () {
                            window.open("https://www.giftcertificatesandmore.com/how-it-works");
                        }));//take user to GCM site
                        msg.commands.append(new Windows.UI.Popups.UICommand("Cancel"));

                        // Set the command that will be invoked by default
                        msg.defaultCommandIndex = 0;

                        // Set the command to be invoked when escape is pressed
                        msg.cancelCommandIndex = 1;

                        msg.showAsync();//do this
                    }
                });

            };

            WinJS.Namespace.define("DataExample", publicMembers);
            WinJS.Namespace.define("Item", {
                redeem: redeemDeal
            });


            element.querySelector(".titlearea .pagetitle").textContent = item.data.vendor ? item.data.vendor.name : "Test group title";
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.subtitle;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.subtitle;
            element.querySelector("article .item-content").innerHTML = item.description;
            element.querySelector("article .item-fineprint").innerHTML = item.data.fine_print;
            //element.querySelector("article .vendor-title").innerHTML = item.data.vendor.name;
            element.querySelector(".content").focus();

            listView.itemDataSource = DataExample.itemList.dataSource;

            //listView.itemDataSource = pageList.dataSource;
            listView.itemTemplate = element.querySelector(".locationtemplate");
            //listView.groupDataSource = pageList.groups.dataSource;
            //listView.groupHeaderTemplate = element.querySelector(".headertemplate");

            //this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();
        }

    });
})();
