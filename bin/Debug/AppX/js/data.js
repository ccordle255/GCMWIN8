(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    //var groupedItems = list.createGrouped(
    //    function groupKeySelector(item) { return item.group.key; },
    //    function groupDataSelector(item) { return item.group; }
    //);
        
    var categories;
    var businesses;

    $.get("http://www.giftcertificatesandmore.com/api/v1/category/list/", function (data) {
        categories = data.data;

        generateSampleData(categories).forEach(function (item) {
            list.push(item);
        });
    });

    $.get("http://www.giftcertificatesandmore.com/api/v1/vendor/list/", function (data) {
        //populate business data
        businesses = data.data;

        
    });
    
    window.makeAuth = function (user, password) {
        var tok = user + ':' + password;
        var hash = Base64.encode(tok);
        return "Basic " + hash;
    };
    
    var url = 'https://www.giftcertificatesandmore.com/api/v1/user/login/';

    // jQuery
    

    WinJS.Namespace.define("Data", {
        groups: list,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < list.length; i++) {
            if (list.getAt(i).key === key) {
                return list.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // Returns an array of sample data that can be added to the application's
    // data list. 
    function generateSampleData(categories) {
        var itemContent = "<h1>$5 Gift Certificate</h3><p>$5 Gift Certificate valid toward Large & XLarge pizza</p><small>Not valid with any other offer, discount, or coupon</small><p>REDEEM THIS DEAL</p>";
        var itemDescription = "Item Description: Pellentesque porta mauris quis interdum vehicula urna sapien ultrices velit nec venenatis dui odio in augue cras posuere enim a cursus convallis neque turpis malesuada erat ut adipiscing neque tortor ac erat";
        var groupDescription = "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante";

        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

        function Group(group, index) {
            return {
                key: index + "group",
                title: group.name,
                subtitle: "subtitle here",
                backgroundImage: group.image_url,
                description: groupDescription,
                id: group.id,
                ncategories: group.ncategories
            };
        }

        var sampleGroups = [];

        var groupIndex = 0;

        for (var item in categories) {
            if (categories[item].parent_id == 0) {
                sampleGroups.push( new Group(categories[item], groupIndex) );
                groupIndex++;
            }
        }

        // Each of these sample items should have a reference to a particular
        // group.
        //var sampleItems = [
        //    { group: sampleGroups[0], title: "Car Insurance", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: "/images/category/81.jpg" },
      

        return sampleGroups;
    }
})();
