import './styles.less';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import PaginationButtons from 'app/components/PaginationButtons';
import Post from 'app/components/Post';
import Loading from 'app/components/Loading';

import { map } from 'lodash/collection';

const T = React.PropTypes;

export const PostsList = (props) => {
  const { loading, postRecords, nextUrl, prevUrl, shouldPage } = props;
  const shouldRenderPagination = !loading && shouldPage && postRecords.length;

  return (
    <div className='PostsList PostAndCommentList'>
      { loading ? renderLoading() : renderPostsList(postRecords) }
      { shouldRenderPagination ? renderPagination(postRecords, nextUrl, prevUrl) : null }
    </div>
  );
};

PostsList.propTypes = {
  loading: T.bool.isRequired,
  postRecords: T.array.isRequired,
  nextUrl: T.string,
  prevUrl: T.string,
  shouldPage: T.bool,
  forceCompact: T.bool,
};

PostsList.defaultProps = {
  shouldPage: true,
};

const renderLoading = () => {
  return <Loading />;
};

const renderPostsList = (records, forceCompact) => {
  return map(records, postRecord => {
    const postId = postRecord.uuid;

    return (
      <Post postId={ postId } forceCompact={ forceCompact } key={ `post-id-${postId}` } />
    );
  });
};

const renderPagination = (postRecords, nextUrl, prevUrl) => (
  <PaginationButtons
    preventUrlCreation={ !!(nextUrl || prevUrl) }
    nextUrl={ nextUrl }
    prevUrl={ prevUrl  }
    records={ postRecords }
  />
);

const listSelector = createSelector(
  (state, props) => state.postsLists[props.postsListId],
  (_, props) => props.nextUrl,
  (_, props) => props.prevUrl,
  (postsList, nextUrl, prevUrl) => ({
    loading: postsList && postsList.loading,
    postRecords: postsList ? postsList.results : [],
  }),
);

export default connect(listSelector)(PostsList);
