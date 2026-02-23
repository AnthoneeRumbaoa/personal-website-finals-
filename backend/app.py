import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app) 

# Connects to your specific Supabase project
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route('/api/comments', methods=['GET'])
def get_comments():
    try:
        response = supabase.table('comments').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments', methods=['POST'])
def add_comment():
    try:
        data = request.json
        name = data.get('name')
        message = data.get('message')
        if not name or not message:
            return jsonify({'error': 'Name and message are required'}), 400

        new_comment = {'name': name, 'message': message}
        response = supabase.table('comments').insert(new_comment).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    try:
        data = request.json
        new_message = data.get('message')
        if not new_message:
            return jsonify({'error': 'Message is required'}), 400

        response = supabase.table('comments').update({'message': new_message}).eq('id', comment_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    try:
        response = supabase.table('comments').delete().eq('id', comment_id).execute()
        return jsonify({'message': 'Comment deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)