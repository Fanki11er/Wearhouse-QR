import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { Tag } from '../../classes/classes';
import router from '../../routes/routes';
import useGoToTheTop from '../../Hooks/useGoToTheTop';
import { tagsPath, baseBranches } from '../../firebase/firebaseEndpoints';
import { getTagKey, getData } from '../../tools/tools';
import UserContext from '../../context/userContext';
import StatusInfoContext from '../../context/StatusInfoContext';
import ItemTag from '../../components/atoms/ItemTag/ItemTag';
import ErrorInfo from '../../components/atoms/ErrorInfo/ErrorInfo';
import LoadingImage from '../../components/atoms/LoadingImage/LoadingImage';
import MenuButton from '../../components/atoms/MenuButton/MenuButton';

const StyledWrapper = styled.div`
  padding-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: ${({ theme }) => theme.primary};
`;
const StyledPage = styled.div`
  display: flex;
  flex-flow: wrap row;
  align-content: flex-start;
  padding: 40px 0;
  justify-content: center;
  margin: 30px;
  width: 180mm;
  height: 275mm;
  background-color: #ddd;
  @media (max-width: 600px) {
    height: 277mm;
    transform: scale(0.5);
    margin: -220px 20px;
    padding: 25px 0;
  }
`;

const StyledLoading = styled.div`
  display: flex;
  padding: 100px;
  align-self: center;
  justify-self: center;
`;

const StyledErrorInfo = styled(ErrorInfo)`
  color: black;
  margin: 30px 0;
`;

const StyledMenuButton = styled(MenuButton)`
  color: ${({ theme }) => theme.lightRed};
  border: 2px solid ${({ theme }) => theme.lightRed};
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  margin: 45px 0 0 0;
  width: 500px;
  justify-content: space-around;

  @media (max-width: 600px) {
    width: 350px;
  }
`;

const PrintPage = () => {
  const { scan } = router;
  const [isStoreEmpty, setIsStoreEmpty] = useState<boolean | undefined>(undefined);
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [pagesList, setPagesList] = useState<Array<Tag>[]>([]);
  const [printer, setPrinter] = useState(true);
  const user = useContext(UserContext);
  const sendStatusInfo = useContext(StatusInfoContext);

  const goTop = useGoToTheTop();

  useEffect(() => {
    goTop();
  }, [goTop]);

  useEffect(() => {
    const listener = user ? getData(tagsPath, setIsStoreEmpty, setTagsList) : undefined;
    return () => db.ref(tagsPath).off('value', listener);
  }, [user]);

  const spliceForPages = (tagsList: Tag[]): Array<Tag>[] => {
    const list = [...tagsList];
    const LIMIT = 20;
    const pages: Array<Tag>[] = [];
    do {
      const page = list.splice(0, LIMIT);
      pages.push(page);
    } while (list.length > 0);
    return pages;
  };

  const changePrinter = () => {
    setPrinter(!printer);
  };

  useEffect(() => {
    tagsList.length ? setPagesList(spliceForPages(tagsList)) : setPagesList(spliceForPages([]));
  }, [tagsList]);

  const renderTags = (tagsList: Tag[]) => {
    return tagsList.map((itemTag, index) => {
      return <ItemTag itemTag={itemTag} key={index} deleteTag={deleteTag} />;
    });
  };

  const renderPages = (pagesList: Array<Tag>[]) => {
    return pagesList.length ? (
      pagesList.map((page, index) => {
        return (
          <StyledPage className={printer ? 'pagePrinter' : 'pagePdf'} key={index}>
            {renderTags(page)}
          </StyledPage>
        );
      })
    ) : (
      <StyledLoading>
        <LoadingImage customWidth={100} />
      </StyledLoading>
    );
  };

  const deleteTag = async (id: string) => {
    const tagKey = await getTagKey(id);
    tagKey &&
      db
        .ref('QR/')
        .child(`${baseBranches.tagsBranch}`)
        .update({ [tagKey]: null })
        .then(() => {
          sendStatusInfo({
            status: 'ok',
            message: 'Usunięto',
          });
        })
        .catch(() => {
          sendStatusInfo({
            status: 'error',
            message: 'Nie usunięto',
          });
        });
  };

  const resetTagsList = () => {
    db.ref('QR/')
      .child(`${baseBranches.tagsBranch}`)
      .set('EMPTY')
      .then(() => {
        sendStatusInfo({
          status: 'ok',
          message: 'Zresetoeano',
        });
      })
      .catch(() => {
        sendStatusInfo({
          status: 'error',
          message: 'Nie zresetowano',
        });
      });
  };
  if (!user?.uid) return <Redirect to={scan} />;
  return (
    <StyledWrapper>
      <StyledButtonsWrapper className={'printHide'}>
        <MenuButton onClick={() => changePrinter()}>{printer ? 'PDF' : 'DRUKARKA'}</MenuButton>
        <StyledMenuButton onClick={() => resetTagsList()}>Resetuj</StyledMenuButton>
      </StyledButtonsWrapper>

      {!isStoreEmpty && user ? (
        renderPages(pagesList)
      ) : (
        <StyledPage>
          {user ? (
            <StyledErrorInfo>Brak elementów do wyświetlenia</StyledErrorInfo>
          ) : (
            <StyledErrorInfo>Brak uprawnień</StyledErrorInfo>
          )}
        </StyledPage>
      )}
    </StyledWrapper>
  );
};

export default PrintPage;
