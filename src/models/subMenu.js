import mongoose from "mongoose";

const submenuSchema = mongoose.Schema ({
    area1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    area2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    area3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    area4: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    enlace1: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    enlace2: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    enlace3: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    enlace4: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    }
})

const SubMenu = mongoose.model('SubMenu', submenuSchema);

export default SubMenu