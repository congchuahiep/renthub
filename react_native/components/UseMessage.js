import { onValue, query, ref } from 'firebase/database';
import { useEffect, useState } from "react";
import { db } from '../config/config';

export const useMessages=(chatId)=>{
    const [messages, setMessages]=useState([]);
    useEffect(()=>{
        const messagesRef=query(ref(db,`chats/${chatId}/messages`), orderByChild('createdAt'));

        const unsubcribe = onValue(messagesRef,(snapshot)=>{
            let msgs=[];
            snapshot.forEach((child)=>{
                msgs.push({id:child.key, ...child.val()});
            });
            setMessages(msgs);
        });
        return ()=> unsubcribe();
    },[chatId]);
    return messages;
};