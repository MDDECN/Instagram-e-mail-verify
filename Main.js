rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_requests/{doc} {
      allow create, read: if true;
      allow write: if true;
    }
  }
}

