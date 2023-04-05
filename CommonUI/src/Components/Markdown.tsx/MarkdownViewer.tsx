import React, { FunctionComponent, ReactElement } from 'react';

// https://github.com/remarkjs/react-markdown
import ReactMarkdown from 'react-markdown';

// https://github.com/remarkjs/remark-gfm
import remarkGfm from 'remark-gfm';

export interface ComponentProps {
    text: string;
}

const MarkdownViewer: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <div>
            <ReactMarkdown
                components={{
                    // because tailwind does not supply <h1 ... /> styles https://tailwindcss.com/docs/preflight#headings-are-unstyled
                    h1: ({ ...props }: any) => {
                        return <h1 className="text-4xl " {...props} />;
                    },
                    h2: ({ ...props }: any) => {
                        return <h1 className="text-3xl " {...props} />;
                    },
                    h3: ({ ...props }: any) => {
                        return <h1 className="text-2xl " {...props} />;
                    },
                    h4: ({ ...props }: any) => {
                        return <h1 className="text-xl " {...props} />;
                    },
                    h5: ({ ...props }: any) => {
                        return <h1 className="text-lg " {...props} />;
                    },
                    h6: ({ ...props }: any) => {
                        return <h1 className="text-base " {...props} />;
                    },
                    p: ({ ...props }: any) => {
                        return (
                            <p
                                className="text-sm mt-2 text-gray-500"
                                {...props}
                            />
                        );
                    },
                    li: ({ ...props }: any) => {
                        return (
                            <p
                                className="text-sm mt-2 text-gray-500"
                                {...props}
                            />
                        );
                    },
                    code: ({ ...props }: any) => {
                        return (
                            <p
                                className="bg-gray-50 text-gray-500 p-3 mt-2 mb-2 rounded text-sm text-sm"
                                {...props}
                            />
                        );
                    },
                }}
                remarkPlugins={[remarkGfm]}
            >
                {props.text}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
