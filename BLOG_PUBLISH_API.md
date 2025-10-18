# Blog Publish API Documentation

API endpoints untuk mengatur status publish blog.

## Base URL
```
https://api-kreatifweb.vercel.app/api/blogs
```

## Endpoints

### 1. Publish Blog
Mengubah status blog menjadi published (true)

**Endpoint:** `POST /api/blogs/:id/publish`

**Request:**
```bash
POST https://api-kreatifweb.vercel.app/api/blogs/67123abc456def789/publish
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Blog published successfully",
  "data": {
    "_id": "67123abc456def789",
    "title": "Blog Title",
    "content": "Blog content...",
    "published": true,
    "category": {...},
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-19T12:30:00.000Z"
  }
}
```

### 2. Unpublish Blog
Mengubah status blog menjadi unpublished (false)

**Endpoint:** `POST /api/blogs/:id/unpublish`

**Request:**
```bash
POST https://api-kreatifweb.vercel.app/api/blogs/67123abc456def789/unpublish
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Blog unpublished successfully",
  "data": {
    "_id": "67123abc456def789",
    "title": "Blog Title",
    "content": "Blog content...",
    "published": false,
    "category": {...},
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-19T12:30:00.000Z"
  }
}
```

### 3. Toggle Publish Status
Mengubah status publish blog (dari true ke false atau sebaliknya)

**Endpoint:** `POST /api/blogs/:id/toggle-publish`

**Request:**
```bash
POST https://api-kreatifweb.vercel.app/api/blogs/67123abc456def789/toggle-publish
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Blog published successfully",
  "data": {
    "_id": "67123abc456def789",
    "title": "Blog Title",
    "content": "Blog content...",
    "published": true,
    "category": {...},
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-19T12:30:00.000Z"
  }
}
```

### Error Responses

**Blog Not Found (404):**
```json
{
  "success": false,
  "message": "Blog not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Error message details"
}
```

## cURL Examples

### Publish Blog
```bash
curl -X POST https://api-kreatifweb.vercel.app/api/blogs/YOUR_BLOG_ID/publish
```

### Unpublish Blog
```bash
curl -X POST https://api-kreatifweb.vercel.app/api/blogs/YOUR_BLOG_ID/unpublish
```

### Toggle Publish
```bash
curl -X POST https://api-kreatifweb.vercel.app/api/blogs/YOUR_BLOG_ID/toggle-publish
```

## JavaScript/Fetch Examples

### Publish Blog
```javascript
const publishBlog = async (blogId) => {
  const response = await fetch(`https://api-kreatifweb.vercel.app/api/blogs/${blogId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
};
```

### Toggle Publish
```javascript
const togglePublish = async (blogId) => {
  const response = await fetch(`https://api-kreatifweb.vercel.app/api/blogs/${blogId}/toggle-publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
};
```

## Notes
- Semua endpoint menggunakan HTTP method POST
- Parameter `:id` adalah MongoDB ObjectId dari blog
- Response selalu include data blog yang sudah di-populate dengan category
- Field `published` di model Blog default-nya adalah `false`
