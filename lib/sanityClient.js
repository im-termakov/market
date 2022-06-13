import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'aypth2tc',
  dataset: 'production',
  apiVersion: '2021-10-21',
  token:
    'skvGUf6bFmCQ2Lh775ON5rH3YNBtJhVWzcfqBfVrKPF449ou5sNWGUGGrhae2PoCYBXlcuor3jOU8InMnDYkpRtD24aycNqJuoH55szdlqjatixeZQUSkgt70oE3iRACRqyffoWeqgUG9Dfrm1SV8VT62mG3Q6zrUtPF3r99IA512UMI29v4',
  useCdn: false,
})
