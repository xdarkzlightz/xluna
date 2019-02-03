export default function migrate (db) {
  const data = db

  if (!data.selfroles) data.selfroles = { roles: [] }
}
