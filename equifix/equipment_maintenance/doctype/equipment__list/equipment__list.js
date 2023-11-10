// Copyright (c) 2023, CE Construction and contributors
// For license information, please see license.txt

frappe.ui.form.on("Equipment  List", {
	refresh(frm) {

	},
    onload:function(frm) {
        var childTable = frm.doc.table_yezm;
        console.log("hello bag")
        
        var today = new Date(frappe.datetime.get_today());

        for( var x =0; x < childTable.length; x++ ){
            if(childTable[x].expiry_date){
                var expiryDate = new Date(childTable[x].expiry_date);
                var ins_date = frappe.datetime.get_diff(expiryDate, today);
                

                if (ins_date === 0){
                    childTable[x].days_left= "0";
                }
                else{
                    childTable[x].days_left= ins_date;
                }
                
                if (childTable[x].days_left <= 0) {
                    childTable[x].status= "Expired";
                } else if (!childTable[x].days_left) {
                    childTable[x].status= "";
                } else {
                    childTable[x].status= "Active";
                }
            }
           
        }
      
        
        },
        setup:function(frm){

            frm.set_query("to", "site_date_table", function(doc, cdt, cdn) { 
                let child = locals[cdt][cdn];
                let filters = [];
    
                // Check if the project field is filled
                if (child.from) {
                    filters.push(['Branch', 'name', '!=', child.from]);
                }
    
                return {
                    filters: filters
                };
            });
    
            frm.set_query("from", "site_date_table", function(doc, cdt, cdn) { 
                let child = locals[cdt][cdn];
                let filters = [];
    
                // Check if the project field is filled
                if (child.to) {
                    filters.push(['Branch', 'name', '!=', child.to]);
                }
    
                return {
                    filters: filters
                };
            });
        }
    
  
});

frappe.ui.form.on('Equipment Insurance', {
	refresh(frm) {
		// your code here
	},
    expiry_date: function (frm, cdt, cdn) {
        updateStatusAndRemainingDays(frm, cdt, cdn);
       
    },

})

function updateStatusAndRemainingDays(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var expiryDate = new Date(child.expiry_date);
    var today = new Date(frappe.datetime.get_today());

    var ins_date = frappe.datetime.get_diff(expiryDate, today);
    console.log(ins_date);
    if (ins_date === 0){
        frappe.model.set_value(cdt, cdn, 'days_left', "0");
    }
    else{
        frappe.model.set_value(cdt, cdn, 'days_left', ins_date);
    }
    

    if (child.days_left <= 0) {
        frappe.model.set_value(cdt, cdn, 'status', "Expired");
    } else if (!child.days_left) {
        frappe.model.set_value(cdt, cdn, 'status', " ");
    } else {
        frappe.model.set_value(cdt, cdn, 'status', "Active");
    }
   
}


frappe.ui.form.on('To And From Location', {
	refresh(frm) {
		// your code here
	},
    site_date_table_add:function(frm, cdt, cdn) {
		// your code here
        
        var child = locals[cdt][cdn];
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: 'full_name'
            },
            callback: function(response) {
                var full_name = response.message.full_name;
                frappe.model.set_value(cdt, cdn, 'user', full_name);
                //frappe.model.set_df_property(cdt, cdn,'user', 'read_only', 1);
                
            }
        });

            var childTable = frm.doc.site_date_table;
            var currentIndex = childTable.indexOf(child);
    
            if (currentIndex > 0) {
                var previousRow = childTable[currentIndex - 1];
                child.from = previousRow.to;
                frm.refresh_field('site_date_table');
            }
        
    },
    to:function(frm, cdt, cdn){
        findCurrentLocation(frm);
    },
    from:function(frm, cdt, cdn){
        findCurrentLocation(frm);
    },
    site_date_table_remove:function(frm){
        findCurrentLocation(frm);
    },
})


function findCurrentLocation(frm){
    var lastRow = null;
    frm.set_value('purchase_location', frm.doc.site_date_table[0].from);
    // Check if the child table "item" exists
    if (frm.doc.site_date_table && frm.doc.site_date_table.length > 0) {
        lastRow = frm.doc.site_date_table[frm.doc.site_date_table.length - 1];
        frm.set_value('current_location', lastRow.to);
       
    }
    else{
        frm.set_value('custom_current_location', "");
    }
    
}