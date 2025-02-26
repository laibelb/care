class User {
  constructor(id, name, email, phone, role, familyId) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role; // 'caregiver', 'admin', etc.
    this.familyId = familyId;
  }
}

export default User;