<template>
  <div class="messages-page">
    <div class="messages-layout">
      <!-- Conversation List -->
      <div class="conversations-panel">
        <div class="conversations-header">
          <h3>Messages</h3>
          <button class="new-msg-btn" @click="startNewConversation">
            <Icon icon="ph:plus" />
          </button>
        </div>
        <div class="conversations-search">
          <Icon icon="ph:magnifying-glass" />
          <input type="text" placeholder="Search conversations..." v-model="searchConvo" />
        </div>
        <div class="conversations-list">
          <div
            v-for="convo in filteredConversations"
            :key="convo.id"
            class="conversation-item"
            :class="{ 'conversation-item--active': activeConvo === convo.id, 'conversation-item--unread': convo.unread }"
            @click="activeConvo = convo.id"
          >
            <div class="convo-avatar">{{ getInitials(convo.name) }}</div>
            <div class="convo-info">
              <div class="convo-name">{{ convo.name }}</div>
              <div class="convo-preview">{{ convo.lastMessage }}</div>
            </div>
            <div class="convo-meta">
              <span class="convo-time">{{ convo.time }}</span>
              <span v-if="convo.unread" class="convo-badge">{{ convo.unreadCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Panel -->
      <div class="chat-panel">
        <template v-if="activeConversation">
          <div class="chat-header">
            <div class="chat-user">
              <div class="chat-avatar">{{ getInitials(activeConversation.name) }}</div>
              <div>
                <div class="chat-name">{{ activeConversation.name }}</div>
                <div class="chat-status">{{ activeConversation.role }}</div>
              </div>
            </div>
            <button class="chat-action" @click="callUser">
              <Icon icon="ph:phone" />
            </button>
          </div>
          <div class="chat-messages" ref="chatContainer">
            <div
              v-for="msg in activeConversation.messages"
              :key="msg.id"
              class="message"
              :class="msg.sent ? 'message--sent' : 'message--received'"
            >
              <div class="message-bubble">
                <p>{{ msg.text }}</p>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <input
              type="text"
              v-model="newMessage"
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
              <Icon icon="ph:paper-plane-tilt-fill" />
            </button>
          </div>
        </template>
        <div v-else class="chat-empty">
          <Icon icon="ph:chat-circle-dots" />
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the left to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const searchConvo = ref('')
const activeConvo = ref(1)
const newMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)

const conversations = ref([
  {
    id: 1, name: 'Uwimana Jean Pierre', role: 'Customer • Kiyovu', lastMessage: 'Yego, nashyize amafaranga', time: '10m', unread: true, unreadCount: 2,
    messages: [
      { id: 1, text: 'Muraho! Urashaka kumenya niba nashyize amafaranga y\'iyi cyumweru?', sent: false, time: '10:20 AM' },
      { id: 2, text: 'Yego, ndashaka kumenya. Niba utabishyize, wahita ubikora.', sent: true, time: '10:22 AM' },
      { id: 3, text: 'Yego, nashyize amafaranga', sent: false, time: '10:30 AM' },
    ]
  },
  {
    id: 2, name: 'Support Team', role: 'AGRUNI Support', lastMessage: 'Your weekly report has been approved', time: '1h', unread: true, unreadCount: 1,
    messages: [
      { id: 1, text: 'Hi Agent Marie, your weekly report for Nyarugenge sector has been submitted successfully.', sent: false, time: '9:00 AM' },
      { id: 2, text: 'Thank you! Is there anything I need to update?', sent: true, time: '9:15 AM' },
      { id: 3, text: 'Your weekly report has been approved. Good work!', sent: false, time: '9:45 AM' },
    ]
  },
  {
    id: 3, name: 'Habimana Patrick', role: 'Customer • Kimihurura', lastMessage: 'I will pay tomorrow morning', time: '2h', unread: false, unreadCount: 0,
    messages: [
      { id: 1, text: 'Hello Patrick, this is a reminder that your weekly payment is overdue by 13 days.', sent: true, time: '8:00 AM' },
      { id: 2, text: 'I know, I have been having some issues. I will pay tomorrow morning', sent: false, time: '8:30 AM' },
    ]
  },
  {
    id: 4, name: 'Ingabire Diane', role: 'Customer • Gisozi', lastMessage: 'Murakoze cyane', time: '1d', unread: false, unreadCount: 0,
    messages: [
      { id: 1, text: 'Muraho Diane, payment yanjye iracyari?', sent: true, time: 'Yesterday 3:00 PM' },
      { id: 2, text: 'Nashyize kuri MoMo igiciro cyose. Murakoze cyane', sent: false, time: 'Yesterday 4:15 PM' },
    ]
  },
])

const filteredConversations = computed(() => {
  if (!searchConvo.value) return conversations.value
  return conversations.value.filter(c => c.name.toLowerCase().includes(searchConvo.value.toLowerCase()))
})

const activeConversation = computed(() => conversations.value.find(c => c.id === activeConvo.value))

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2)

const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeConversation.value) return
  const convo = conversations.value.find(c => c.id === activeConvo.value)
  if (convo) {
    convo.messages.push({
      id: Date.now(),
      text: newMessage.value,
      sent: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    })
    convo.lastMessage = newMessage.value
    convo.time = 'now'
    newMessage.value = ''
    await nextTick()
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const startNewConversation = () => { /* demo placeholder */ }
const callUser = () => { /* demo placeholder */ }
</script>

<style scoped>
.messages-page { height: calc(100vh - 140px); }

.messages-layout { display: flex; height: 100%; background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; }

/* Conversations Panel */
.conversations-panel { width: 340px; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; flex-shrink: 0; }

.conversations-header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #f1f5f9; }
.conversations-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }

.new-msg-btn { width: 36px; height: 36px; border-radius: 10px; border: none; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.new-msg-btn:hover { background: #2563eb; }
.new-msg-btn svg { width: 18px; height: 18px; }

.conversations-search { display: flex; align-items: center; gap: 8px; margin: 12px 16px; padding: 0 14px; height: 40px; background: #f8fafc; border-radius: 10px; border: 1px solid #e5e7eb; }
.conversations-search svg { width: 16px; height: 16px; color: #94a3b8; flex-shrink: 0; }
.conversations-search input { flex: 1; border: none; background: none; font-size: 13px; color: #334155; outline: none; }

.conversations-list { flex: 1; overflow-y: auto; }

.conversation-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; transition: background 0.15s; border-left: 3px solid transparent; }
.conversation-item:hover { background: #f8fafc; }
.conversation-item--active { background: #eff6ff; border-left-color: #3b82f6; }
.conversation-item--unread .convo-name { font-weight: 700; }

.convo-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.convo-info { flex: 1; min-width: 0; }
.convo-name { font-size: 14px; font-weight: 600; color: #0f172a; }
.convo-preview { font-size: 13px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.convo-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.convo-time { font-size: 11px; color: #94a3b8; }
.convo-badge { width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Chat Panel */
.chat-panel { flex: 1; display: flex; flex-direction: column; }

.chat-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.chat-user { display: flex; align-items: center; gap: 12px; }
.chat-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
.chat-name { font-size: 15px; font-weight: 700; color: #0f172a; }
.chat-status { font-size: 12px; color: #94a3b8; }
.chat-action { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e5e7eb; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.chat-action:hover { background: #f8fafc; color: #3b82f6; border-color: #3b82f6; }
.chat-action svg { width: 20px; height: 20px; }

.chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }

.message { display: flex; max-width: 75%; }
.message--sent { align-self: flex-end; }
.message--received { align-self: flex-start; }

.message-bubble { padding: 12px 16px; border-radius: 16px; }
.message--sent .message-bubble { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-bottom-right-radius: 4px; }
.message--received .message-bubble { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }

.message-bubble p { margin: 0 0 4px; font-size: 14px; line-height: 1.5; }
.message-time { font-size: 11px; opacity: 0.7; }

.chat-input { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-top: 1px solid #f1f5f9; }
.chat-input input { flex: 1; height: 44px; padding: 0 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; color: #1e293b; background: #f8fafc; transition: all 0.2s; }
.chat-input input:focus { outline: none; border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

.send-btn { width: 44px; height: 44px; border-radius: 12px; border: none; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.send-btn:hover { box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.send-btn svg { width: 20px; height: 20px; }

.chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; }
.chat-empty svg { width: 56px; height: 56px; margin-bottom: 16px; }
.chat-empty h3 { margin: 0 0 4px; color: #475569; font-size: 18px; }
.chat-empty p { margin: 0; font-size: 14px; }

@media (max-width: 768px) {
  .conversations-panel { width: 100%; }
  .chat-panel { display: none; }
}
</style>
