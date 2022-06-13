// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(
    [
      {
        name: 'users',
        title: 'Users',
        type: 'document',
        fields: [
          {
            name: 'userName',
            title: 'User Name',
            type: 'string',
          },
          {
            name: 'email',
            title: 'Email',
            type: 'string',
          },
          {
            name: 'walletAddress',
            title: 'Wallet Address',
            type: 'string',
          },
          {
            name: 'profileImage',
            title: 'Profile Image',
            type: 'string',
          },
        ],
      },
      {
        name: 'collections',
        title: 'Collections',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
          },
          {
            name: 'contractAddress',
            title: 'Contract Address',
            type: 'string',
          },
          {
            name: 'createdBy',
            title: 'Created By',
            type: 'string',
          },
          {
            name: 'image',
            title: 'Image',
            type: 'string',
          },
        ],
      },
      {
        name: 'operations',
        title: 'Operations',
        type: 'document',
        fields: [
          {
            name: 'nftId',
            title: 'NftId',
            type: 'string',
          },
          {
            name: 'collectionId',
            title: 'Collection',
            type: 'string',
          },
          {
            name: 'price',
            title: 'Price',
            type: 'number',
          },
          {
            name: 'from',
            title: 'From',
            type: 'string',
          },
          {
            name: 'to',
            title: 'To',
            type: 'string',
          },
          {
            name: 'date',
            title: 'Date',
            type: 'date',
          },
        ],
      },
    ]
    /* Your types here! */
  ),
})