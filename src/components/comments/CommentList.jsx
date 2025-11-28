import React, { useState } from 'react';
import { CommentCard } from './CommentCard';

export const CommentList = ({ comments, moduleId, onToast }) => {
    const [showAll, setShowAll] = useState(false);

    if (comments.length === 0) {
        return (
            <div className="text-center text-muted py-3">
                <i className="bi bi-inbox fs-4"></i>
                <p className="small mb-0 mt-2">No comments yet. Add one to track failures and fixes.</p>
            </div>
        );
    }

    const latestComments = comments.slice(-2).reverse();
    const allComments = [...comments].reverse();

    return (
        <>
            {!showAll ? (
                <div className="compact-view">
                    {latestComments.map(comment => (
                        <CommentCard
                            key={comment.timestamp}
                            comment={comment}
                            moduleId={moduleId}
                            onToast={onToast}
                        />
                    ))}
                    {comments.length > 2 && (
                        <div className="text-center mt-2">
                            <button
                                className="btn btn-sm btn-link text-muted"
                                onClick={() => setShowAll(true)}
                            >
                                <i className="bi bi-chevron-down me-1"></i>
                                Show {comments.length - 2} more comment{comments.length - 2 > 1 ? 's' : ''}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="full-view">
                    {allComments.map(comment => (
                        <CommentCard
                            key={comment.timestamp}
                            comment={comment}
                            moduleId={moduleId}
                            onToast={onToast}
                        />
                    ))}
                    <div className="text-center mt-2">
                        <button
                            className="btn btn-sm btn-link text-muted"
                            onClick={() => setShowAll(false)}
                        >
                            <i className="bi bi-chevron-up me-1"></i>Show less
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
