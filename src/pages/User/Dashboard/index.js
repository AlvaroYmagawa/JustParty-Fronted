import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { DefaultButton } from '~/components/Buttons';
import api from '~/services/api';
import {
  addWishRequest,
  removeWishRequest,
} from '~/store/modules/wishlist/actions';

import Header from '~/components/User/Header';
import PromoterImage from '~/components/Avatar';
import BannerImage from '~/components/Banner';
import colors from '~/styles/colors';

import {
  Container,
  EventList,
  Event,
  Description,
  EventHeader,
  FavoriteButton,
} from './styles';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const wishlist = await api.get('wishlists');
      const response = await api.get('events');

      const data = response.data.map(event => ({
        ...event,
        favorited: wishlist.data.filter(wish => wish.event_id === event.id),
        day: format(parseISO(event.date), 'dd', {
          locale: pt,
        }),
        mounth: format(parseISO(event.date), 'MMMM', {
          locale: pt,
        }),
        hours: format(parseISO(event.date), 'HH:mm', {
          locale: pt,
        }),
      }));

      setEvents(data);
    }

    loadEvents();
  }, []);

  return (
    <>
      <Header tittle="DASHBOARD" />
      <Container>
        <h1>Eventos</h1>
        <EventList>
          {events.map(
            event =>
              !event.past && (
                <Event key={event.id}>
                  <EventHeader>
                    <div>
                      <Link to={`/users/${event.promoter.id}`}>
                        <div className="promoterImage">
                          <PromoterImage
                            src={event.promoter.File.url}
                            size={40}
                          />
                        </div>
                      </Link>
                      <Link to={`/users/${event.promoter.id}`}>
                        <h4>{event.promoter.name}</h4>
                      </Link>
                    </div>

                    {event.favorited.length === 0 ? (
                      <FavoriteButton
                        type="button"
                        onClick={() => {
                          dispatch(addWishRequest(event.id));
                        }}
                      >
                        <IoIosHeartEmpty color={colors.text} />
                      </FavoriteButton>
                    ) : (
                      <FavoriteButton
                        type="button"
                        onClick={() => {
                          dispatch(removeWishRequest(event.id));
                        }}
                      >
                        <IoIosHeart color={colors.primary} />
                      </FavoriteButton>
                    )}
                  </EventHeader>
                  <Link to={`/events/${event.id}`}>
                    <BannerImage src={event.banner.url} size={300} />
                  </Link>
                  <Description>
                    <section>
                      <div className="date">
                        <h3>{event.mounth}</h3>
                        <h2>{event.day}</h2>
                      </div>
                      <tr />
                      <div className="description">
                        <h2>{event.name}</h2>
                        <span>{event.description}</span>
                      </div>
                    </section>

                    <div className="buttons">
                      <DefaultButton type="button">Comprar</DefaultButton>
                    </div>
                  </Description>
                </Event>
              )
          )}
        </EventList>
      </Container>
    </>
  );
}
