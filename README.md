
# Ping Learning CLI

## About

Ping learning currently is a command line application that allows users to sign up, specify a general category that they are learning, and then track what they are learning via pings. The idea behind pings, is simply to ping what they are
learning so that they can view the last time they have taken time to learn something and then track their learning across all categories.

## Schema Model

Schema Model is obtained using Mongoose.populate method : http://mongoosejs.com/docs/populate.html

Users -- > 
            Categories (linked via a User _id) -- > 
                                                        Journey (linkes via Category _id which is in turn linkes via User _id) -- > 
                                                                                                                                        Pings --> (Linked to Journey _id, which is linked to rest)