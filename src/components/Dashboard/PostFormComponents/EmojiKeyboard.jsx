import React from 'react'
import EmojiPicker from 'emoji-picker-react'

import '../../../styles/dashboard/postFormComponentsStyles/emojiKeyboard.css'

function EmojiKeyboard({setOpenForm, content, setContent}) {

    const handleEmojiClick = (emojiObject) => {
        setOpenForm(null);
        setContent(content + emojiObject.emoji);
    }

    return (
        <div className='emojikeyboard-container'>
            <EmojiPicker
                theme='dark'
                emojiStyle='native'
                width={475}
                height={350}
                lazyLoadEmojis={true}

                onEmojiClick={(emojiObject) => {
                    handleEmojiClick(emojiObject);
                }}
            />
        </div>
    )
}

export default EmojiKeyboard