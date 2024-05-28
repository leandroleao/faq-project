import * as React from 'react';

export function FaqsEl(faqs: any) {

        console.log(faqs);
        faqs.map(({ id, answer }) => (
            <span key={id}>{answer}</span>
        ))
    

}