import React, { useContext } from 'react';
import styled from 'styled-components';
import OrderContext from '../../../context/orderContext';
import { storeItem } from '../../../types/types';
import { addNewTag, createItemTag } from '../../../tools/tools';
import StoreItem from '../../molecules/StoreItem/StoreItem';
import LoadingImage from '../../atoms/LoadingImage/LoadingImage';
import ErrorInfo from '../../atoms/ErrorInfo/ErrorInfo';

const StyledWrapper = styled.ol`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 870px;
  height: 400px;
  border: 2px solid ${({ theme }) => theme.primaryBlue};
  border-radius: 25px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin: 30px 120px;
  padding: 0 10px;

  @media (max-width: 896px) {
    margin: 30px 90px;
  }

  @media (max-width: 600px) {
    width: 350px;
    margin: 30px 0;
  }
`;

const StyledLoading = styled.div`
  padding: 100px;
`;

type Props = {
  items: storeItem[];
  isStoreEmpty: boolean;
  toggleEditItemModal: (a: storeItem) => void;
  sortByName: boolean;
};

const StyledErrorInfo = styled(ErrorInfo)`
  margin: 100px 0;
`;

const StoreItemsView = (props: Props) => {
  const { isStoreEmpty, items, toggleEditItemModal, sortByName } = props;
  const orderItem = useContext(OrderContext);
  const actions = { addNewTag, toggleEditItemModal, orderItem, createItemTag };

  const renderItems = (items: storeItem[]) => {
    return items.length ? (
      items
        .sort((a, b) => {
          if (sortByName) {
            if (a.orderDescription > b.orderDescription) {
              return 1;
            } else if (a.orderDescription < b.orderDescription) {
              return -1;
            }
            return 0;
          }
          return b.id - a.id;
        })
        .map((item, index) => {
          return <StoreItem item={item} key={index} actions={actions} />;
        })
    ) : (
      <StyledLoading>
        <LoadingImage customWidth={85} />
      </StyledLoading>
    );
  };
  return (
    <StyledWrapper className={'withScroll'}>
      {isStoreEmpty ? (
        <StyledErrorInfo>Brak elementów do wyświetlenia</StyledErrorInfo>
      ) : (
        renderItems(items)
      )}
    </StyledWrapper>
  );
};

export default StoreItemsView;
