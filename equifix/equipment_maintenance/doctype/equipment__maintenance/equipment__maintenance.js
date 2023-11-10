// Copyright (c) 2023, CE Construction and contributors
// For license information, please see license.txt

frappe.ui.form.on("Equipment  Maintenance", {
	refresh(frm) {
        var childTable = frm.doc.table_hnlr;
        
        if (childTable && childTable.length > 0) {
            lastRow = childTable[childTable.length - 1];
            frm.set_value('status', lastRow.equip_status);
           
        }
       
        cur_frm.set_df_property('table_hnlr', 'cannot_delete_rows', 1); 
        // if (childTable.length > 1) {
        //     for (var i = 1; i < childTable.length; i++) {
        //         cur_frm.fields_dict['table_hnlr'][i].cannot_delete_rows = 1;
        //     }
        // }
    
	},
    equipment_id:function(frm) {
        console.log("hello")
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'Equipment  List',
                filters: { name: frm.doc.equipment_id },
                fieldname: 'equipment_name'
            },
            callback: function(response) {
                var full_name = response.message.equipment_name;

                // Set the value to the field in the child table
                frm.set_value('equipment_name', full_name);
                
            }
        });

	},
});

frappe.ui.form.on('Equipment History', {
	refresh(frm) {
        
           
           
    
	},
    on_submit: function (frm) {
        // Your code here
    },
    delete: function(frm, cdt, cdn){
        var child = locals[cdt][cdn];
    var childTable = frm.doc.table_hnlr;
    
    if(childTable.length > 1){
    // Find the index of the row you want to delete
    for (var i = 1; i < childTable.length; i++) {
        if (childTable[i].name === child.name ) {
            childTable.splice(i, 1);
            cur_frm.refresh_field('table_hnlr');
            break;
        }
    }
    }
    if(childTable[0] && child.idx === 1){
    frappe.msgprint
    ({
       title: __('Warning'),
       message: __('First row of table required.'),
       indicator: 'red',
       primary_action: 
       {
           label: __('OK'),
           action: function() 
           {
               // Do something when the user clicks "OK"
               cur_dialog.hide();
           }
       }
   });
}}
  
})
