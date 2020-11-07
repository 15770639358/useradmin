export default [
  {
    role: 'admin',
    auths: ['btn/page/addRole','btn/page/removeRole','btn/page/readRole']
  },
  {
    role: 'editor',
    auths: ['btn/page/removeRole','btn/page/readRole']
  },
  {
    role: 'reader',
    auths: ['btn/page/readRole']
  }
]
