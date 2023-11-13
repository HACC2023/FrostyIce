const Message = {
  timestamp: {
    required: true,
    type: Date,
    default: Date.now,
  },

  authorName: {
    type: String,
    required: true,
    trim: true,
  },

  authorEmail: {
    type: String,
    required: true,
    trim: true,
  },

  authorOrganization: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
    trim: true,
  },
};

export default Message;
