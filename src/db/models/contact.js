import { model, Schema } from 'mongoose';

const Contact = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },

  phoneNumber: {
    type: String,
    required: [true, 'Set phone number for contact'],
  },

  email: {
    type: String,
    optional: true,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'personal', 'home'],
    default: 'personal',
  },
});

export const ContactsCollection = model('contacts', Contact);
