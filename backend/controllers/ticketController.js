const Ticket = require("../models/ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");
const user = require("../models/user");

const createTicket = async (req, res) => {
    const { title, description, category, priority, photoUrls } = req.body;
    if (!title || !description || !category) {
        throw new CustomError.BadRequestError("Please provide all required fields");
    }

    const ticket = await Ticket.create({
        title,
        description,
        category,
        priority,
        photoUrls,
        createdBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ ticket });
};

const getAllTickets = async (req, res) => {
    let tickets;
    if (req.user.role === "superadmin") {
        tickets = await Ticket.find({}).populate("createdBy", "email fname lname userName");
    } else if (req.user.role === "admin") {
        tickets = await Ticket.find({ branch: req.user.branch }).populate("createdBy", "email fname lname userName");
    }

    res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
};

const getSingleTicket = async (req, res) => {
    const { id: ticketId } = req.params;

    const ticket = await Ticket.findOne({ _id: ticketId }).populate("createdBy", "email fname lname userName");

    if (!ticket) {
        throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
    }

    checkPermission(req.user, ticket.createdBy._id);

    res.status(StatusCodes.OK).json({ ticket });
};

const updateTicket = async (req, res) => {
    const { id: ticketId } = req.params;
    const { title, description, category, priority, status } = req.body;

    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
        throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
    }

    checkPermission(req.user, ticket.createdBy);

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.category = category || ticket.category;
    ticket.priority = priority || ticket.priority;
    ticket.status = status || ticket.status;

    await ticket.save();

    res.status(StatusCodes.OK).json({ ticket });
};

const deleteTicket = async (req, res) => {
    const { id: ticketId } = req.params;

    const ticket = await Ticket.findOneAndDelete({ _id: ticketId });

    if (!ticket) {
        throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
    }

    res.status(StatusCodes.OK).json({ msg: "Ticket removed", ticket });
};

const getCurrentUserTickets = async (req, res) => {
    const tickets = await Ticket.find({ createdBy: req.user.userId });

    res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
};

// In your ticketController.js
const getTicketStats = async (req, res) => {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const archiveTickets = await Ticket.countDocuments({ status: 'Archived' });

    // Calculate average resolution time (this is a simplified example)
    const closedTicketsWithDuration = await Ticket.find({ status: 'closed' });
   
    res.json({
        totalTickets,
        openTickets,
        closedTickets,
        inProgressTickets,
        resolvedTickets,
        archiveTickets
    });
};

const getLatestTickets = async (req, res) => {
    try {
        const latestTickets = await Ticket.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id title status priority createdAt');

        res.json(latestTickets);
    } catch (error) {
        console.error('Error fetching latest tickets:', error);
        res.status(500).json({ message: 'Error fetching latest tickets' });
    }
};

const getArchivedTickets = async (req, res) => {
    try {
        const archive = await Ticket.find({ status: 'Archived' });
        res.json( archive );
    } catch (error) {
        console.error('Error fetching Archived tickets:', error);
        res.status(500).json({ message: 'Error fetching Archived tickets' });
    }
}

const assignTicket = async (req, res) => {
    const { id: ticketId } = req.params;
    const { adminId } = req.body;

    if (!adminId) {
      throw new CustomError.BadRequestError('Please provide an admin ID');
    }
  
    const ticket = await Ticket.findOne({ _id: ticketId });
  
    if (!ticket) {
      throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
    }
  
    const admin = await user.findOne({ _id: adminId, role: 'admin' });
  
    if (!admin) {
      throw new CustomError.NotFoundError(`No admin found with id ${adminId}`);
    }
  
    ticket.assignedTo = adminId;
    await ticket.save();
  
    res.status(StatusCodes.OK).json({ ticket });
  };

module.exports = {
    createTicket,
    getAllTickets,
    getSingleTicket,
    updateTicket,
    deleteTicket,
    getCurrentUserTickets,
    getTicketStats,
    getLatestTickets,
    getArchivedTickets,
    assignTicket
};