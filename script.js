class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = this.getAttribute('role') || 'ai';

    const base =
      'max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm';

    const aiStyle = 'bg-white border text-gray-900';
    const userStyle = 'bg-blue-600 text-white';

    this.className = `${base} ${role === 'user' ? userStyle : aiStyle}`;
  }
}

customElements.define('chat-message', ChatMessage);

