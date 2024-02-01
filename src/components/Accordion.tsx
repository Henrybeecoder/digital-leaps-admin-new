import {
  Content,
  Header,
  Item,
  Root,
  Trigger,
} from '@radix-ui/react-accordion';
import './accordion.css';

interface Props {
  list: { title: string; items: string[] }[];
  type?: 'single' | 'multiple';
  showLength?: string;
}

const Accordion = ({ list, type = 'single', showLength }: Props) => {
  return (
    <Root className='AccordionRoot' type={type} collapsible={true}>
      {list?.map((x) => (
        <Item className='AccordionItem' value={x?.title} key={x.title}>
          <Header className='AccordionHeader'>
            <Trigger className='AccordionTrigger'>
              <svg
                className='AccordionChevron'
                aria-hidden
                xmlns='http://www.w3.org/2000/svg'
                width='23'
                height='23'
                viewBox='0 0 26 25'
                fill='none'>
                <path d='M12.4913 16.1347L4.4489 7.69394C4.31464 7.55311 4.23975 7.36599 4.23975 7.17141C4.23975 6.97683 4.31464 6.78972 4.4489 6.64888L4.45799 6.6398C4.52308 6.57128 4.60142 6.51673 4.68826 6.47945C4.77509 6.44217 4.8686 6.42294 4.9631 6.42294C5.0576 6.42294 5.15112 6.44217 5.23795 6.47945C5.32479 6.51673 5.40313 6.57128 5.46822 6.6398L13.0411 14.5883L20.611 6.6398C20.6761 6.57128 20.7545 6.51673 20.8413 6.47945C20.9281 6.44217 21.0216 6.42294 21.1161 6.42294C21.2106 6.42294 21.3041 6.44217 21.391 6.47945C21.4778 6.51673 21.5562 6.57128 21.6212 6.6398L21.6303 6.64888C21.7646 6.78972 21.8395 6.97683 21.8395 7.17141C21.8395 7.36599 21.7646 7.55311 21.6303 7.69394L13.5879 16.1347C13.5172 16.2089 13.4321 16.268 13.3379 16.3084C13.2436 16.3488 13.1422 16.3696 13.0396 16.3696C12.9371 16.3696 12.8356 16.3488 12.7414 16.3084C12.6471 16.268 12.5621 16.2089 12.4913 16.1347Z' />
              </svg>

              <span>
                <p>{x?.title}</p>
                {showLength && x.items && (
                  <p>
                    {x.items.length} {showLength}
                    {x.items.length > 1 && 's'}
                  </p>
                )}
              </span>
            </Trigger>
          </Header>
          <Content className='AccordionContent'>
            {x?.items?.map((x) => (
              <p key={x}>{x}</p>
            ))}
          </Content>
        </Item>
      ))}
    </Root>
  );
};

export default Accordion;
