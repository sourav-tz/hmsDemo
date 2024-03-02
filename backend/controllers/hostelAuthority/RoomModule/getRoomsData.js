const db = require("../../../models");


const getRoomsData = async (req, res) => {

    try {

        const filters = {};
        const hostelNo = req.query.hostelNo

        // filters based on query parameters
        if (req.query.roomNo) {
            filters.roomNo = req.query.roomNo;
        }

        if (req.query.status) {
            filters.status = req.query.status;
        }

        if (req.query.floorNo) {
            filters.floorNo = req.query.floorNo;
        }

        filters.hostelNo = hostelNo
        // filters.roomNo = 435
        // Data sorting queries 
        const sortField = req.query.sortField || 'roomNo'; // Default sort field is 'name' if not provided
        const sortOrder = req.query.sortOrder === 'desc' // Sort order, default is ascending

        // pagination queries
        let totalpages = parseInt(req.query.total) || 0;
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default page size is 10 if not provided

        if (totalpages === 0) {
            totalpages = Math.ceil((await db.roomsStudentMapping.count({
                where: { hostelNo: hostelNo, checkOutDate: null },
                include: [
                    {
                        model: db.students,
                    },
                    {
                        model: db.rooms,
                        where: filters
                    }
                ]
            })) / limit);
            console.log(totalpages);
            if (totalpages == 0) {
                return res.json({ totalpages: 0, msg: "no pages to show" });
            }
            if (page > totalpages || page < 1) {
                return res.json({ msg: `page value out of range, total pages are ${totalpages}` });
            }
        }

        const startIndex = (page - 1) * limit;
        // Fetch data from the student table based on filters
        // const roomsData = await db.roomsStudentMapping.findAll({
        //     where: { ...filters, checkOutDate: null },
        //     offset: startIndex,
        //     limit: limit,
        //     include: [
        //         {
        //             model: db.rooms,
        //             where: filters,
        //         }, {
        //             model: db.students
        //             , where: filters
        //         }
        //     ]
        // });

        const roomsData = await db.rooms.findAll({
            where: filters,
            offset: startIndex,
            limit: limit,
            include: [
                {
                    model: db.roomsStudentMapping,
                    where: { checkOutDate: null },
                    include: [{
                        model: db.students,

                    }]
                }
            ]
        });
        // Return the result
        nextPage = page >= totalpages ? totalpages : page + 1
        roomsData.unshift({
            next: {
                page: nextPage,
                limit: limit,
                totalpages: totalpages
            }
        });
        prevPage = page > 1 ? page - 1 : 1
        roomsData.unshift({
            previous: {
                page: prevPage,
                limit: limit,
                totalpages: totalpages
            }
        })
        return res.json(roomsData);



    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


module.exports = getRoomsData