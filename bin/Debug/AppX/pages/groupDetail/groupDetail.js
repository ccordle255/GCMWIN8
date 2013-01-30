(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    function Subcat(obj, groupKey) {
        return {
            title: obj.name,
            subtitle: "Item Subtitle: 1",
            description: "blahblah",
            content: "contentcontent",
            backgroundImage: obj.image_url,
            groupKey: groupKey,
            id: obj.id,
            type: obj.type
        }
    }

//    { group: sampleGroups[0], title: "Car Insurance", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: "/images/category/81.jpg" }

    function Item() {
        return {

        }
    }

    ui.Pages.define("/pages/groupDetail/groupDetail.html", {
        /// <field type="WinJS.Binding.List" />
        _items: null,

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            var group;
            if (options.item)
                group = options.item;
            else
                group = (options && options.groupKey) ? Data.resolveGroupReference(options.groupKey) : Data.groups.getAt(0);
            this._items = new WinJS.Binding.List();

            var $this = this;
            if (group.ncategories) {
                $.get("http://www.giftcertificatesandmore.com/api/v1/category/list/?category_id=" + group.id, function (subcats) {
                    for (var i = 0; i < subcats.data.length; i++) {
                        $this._items.push(new Subcat(subcats.data[i], group.key));
                    }
                });
            } else {
                $.get("http://www.giftcertificatesandmore.com/api/v1/deal/list/?category_id=" + group.id, function (subcats) {
                    for (var i = 0; i < subcats.data.length; i++) {
                        $this._items.push(new Subcat(subcats.data[i], group.groupKey));
                    }
                });
            }
            
            //this._items = Data.getItemsFromGroup(group);
            var pageList = this._items.createGrouped(
                function groupKeySelector(item) {
                    return group.key ? group.key : group.groupKey;
                },
                function groupDataSelector(item) { return group; }
            );

            element.querySelector("header[role=banner] .pagetitle").textContent = group.title;

            listView.itemDataSource = pageList.dataSource;
            listView.itemTemplate = options.item ? element.querySelector(".itemtemplate") : element.querySelector(".subcat");
            listView.groupDataSource = pageList.groups.dataSource;
            listView.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView.oniteminvoked = this._itemInvoked.bind(this);

            this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();
        },

        unload: function () {
            //this._items.dispose();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
            }
        },

        _itemInvoked: function (args) {
            var item = this._items.getAt(args.detail.itemIndex);
            if (item.type === "category")
                WinJS.Navigation.navigate("/pages/groupDetail/groupDetail.html", { item: item });
            else if (item.type === "deal")
                WinJS.Navigation.navigate("/pages/itemDetail/itemDetail.html", { item: item });
        }
    });
})();
