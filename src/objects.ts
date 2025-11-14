export interface Supplier {
    supplier_id: string;
    company_name: string;
    contact_no: string;
}

export interface Livestock {
    livestock_id: string;
    breed: string;
    weight: number;
    age: number;
    country_of_origin: string;
    medical_condition: string;
    vaccination_status: "Vaccinated" | "Not Vaccinated" | "Pending";
    date_arrived: string;
    storage_location: string;
    supplier_id: string;
    status: "For Processing" | "Processed" | "Discarded";
    processing_date?: string | null;
}

export interface MeatSelection {
    serial_no: string;
    cut_type:  'Arm Chuck Roast' | 'Cross Rib Chuck Roast' | 'Prime Rib Roast' | 'Porterhouse Steak'
            | 'Top Sirloin Steak' | 'Top Round' | 'Kabobs' | 'Arm Chuck Steak' | 'Shoulder Roast'
            | 'Ribeye Steak, Bone-In' | 'T-Bone Steak' | 'Top Sirloin Petite Roast' | 'Top Round Steak'
            | 'Stew Meat' | 'Blade Chuck Roast' | 'Shoulder Steak' | 'Back Ribs'
            | 'Strip Steak, Bone-In' | 'Top Sirloin Filet' | 'Bottom Round Roast' | 'Strips'
            | 'Blade Chuck Steak' | 'Ranch Steak' | 'Ribeye Roast, Boneless' | 'Strip Steak, Boneless'
            | 'Coulotte Roast' | 'Bottom Round Rump Roast' | 'Cubed Steak' | '7-Bone Chuck Roast'
            | 'Flat Iron Steak' | 'Ribeye Steak, Boneless' | 'Strip Petite Roast' | 'Coulotte Steak'
            | 'Ground Beef and Ground Beef Patties' | 'Chuck Center Roast' | 'Top Blade Steak'
            | 'Ribeye Cap Steak' | 'Strip Filet' | 'Tri-Tip Roast' | 'Eye of Round Roast'
            | 'Shank Cross-Cut' | 'Denver Steak' | 'Shoulder Petite Tender' | 'Ribeye Petite Roast'
            | 'Tenderloin Roast' | 'Tri-Tip Steak' | 'Eye of Round Steak' | 'Tenderloin Tips'
            | 'Chuck Eye Roast' | 'Shoulder Petite Tender Medallions' | 'Ribeye Filet'
            | 'Tenderloin Steak (Filet Mignon)' | 'Petite Sirloin Steak' | 'Brisket Flat'
            | 'Inside Skirt' | 'Flank Steak' | 'Short Ribs, Bone-In' | 'Chuck Eye Steak'
            | 'Sirloin Bavette Steak' | 'Brisket Point' | 'Country-Style Ribs';
    weight: number;
    expiry_date: string;
    storage_location: string;
    quality_control_clearance: 'Pending' | 'Approved' | 'Rejected';
    status: 'Available' | 'Reserved' | 'Sold' | 'Discarded';
    origin_livestock_id: string;
}

export interface Nutrition {
    item_serial_no: string;
    tenderness:  'Very Tender' | 'Tender' | 'Moderate' | 'Tough';
    color:  'Bright Red' | 'Dark Red' | 'Pale' | 'Brownish';
    fat_content: number;
    protein_content: number;
    connective_tissue_content: number;
    water_holding_content: number;
    pH : number;
    water_distribution : number;
}

export interface Client {
    restaurant_code : string;
    client_name : string;
    restaurant_name : string;
    restaurant_type : string;
    restaurant_address : string;
    contact_no : string;
    email_address : string;
    year_of_establishment : number;
}

export interface Delivery {
    delivery_no : number;
    driver_name : string;
    truck_number : number;
    deliver_date : string;
    distance_travelled : number;
    delivery_duration : number;
    weight : number;
    restaurant_code : string;
    status : 'Pending' | 'Delivered' | 'Cancelled' | 'Returned';
    profit : number;
}   

export interface OrderLine {
    order_line_no : number;
    item_serial_no : string;
}

export interface Agreement {
    restaurant_code : string;
    client_pricing : number;
    week_of_delivery : number;
    cut_type_of_choice : MeatSelection['cut_type'];
    weight : number
    tenderness? : Nutrition['tenderness'] | null;
    color? : Nutrition['color'] | null;
    fat_content? : number | null;
    protein_content? : number | null;
    connective_tissue_content? : number | null;
    water_holding_capacity? : number | null;
    pH? : number | null;
    water_distribution? : number | null;
}