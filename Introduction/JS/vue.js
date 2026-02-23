const app = Vue.createApp({
  data() {
    return {
      TheArchive: [
        'Introduction/1.jpg', 'Introduction/2.jpg', 'Introduction/3.jpg',
        'Introduction/4.jpg', 'Introduction/5.jpg', 'Introduction/6.jpg',
        'Introduction/7.jpg', 'Introduction/8.jpg', 'Introduction/9.jpg'
      ],
      comments: [],
      newComment: { name: '', message: '' },
      isSubmitting: false,
      
      // Edit state
      editingId: null,
      editForm: { message: '' },
      
      apiUrl: 'https://personal-website-finals-jezt.onrender.com/api/comments' 
    }
  },
  methods: {
    // READ
    async fetchComments() {
      try {
        const response = await fetch(this.apiUrl);
        if (response.ok) this.comments = await response.json();
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    
    // CREATE
    async submitComment() {
      if (!this.newComment.name || !this.newComment.message) return;
      this.isSubmitting = true;
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newComment)
        });
        if (response.ok) {
          this.newComment.name = '';
          this.newComment.message = '';
          await this.fetchComments(); 
        }
      } catch (error) {
        console.error("Error submitting:", error);
      } finally {
        this.isSubmitting = false;
      }
    },

    // UPDATE UI Triggers
    startEdit(comment) {
      this.editingId = comment.id;
      this.editForm.message = comment.message;
    },
    cancelEdit() {
      this.editingId = null;
      this.editForm.message = '';
    },

    // UPDATE 
    async updateComment(id) {
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: this.editForm.message })
        });
        if (response.ok) {
          this.cancelEdit();
          await this.fetchComments();
        }
      } catch (error) {
        console.error("Error updating:", error);
      }
    },

    // DELETE
    async deleteComment(id) {
      if (!confirm("Are you sure you want to delete this message?")) return;
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await this.fetchComments();
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  },
  mounted() {
    this.fetchComments();
  }
})

app.mount('#app')