import './board.scss';
import { JSX } from 'react';
import { BoardProps } from 'common/interfaces/IBoardProps';
import { getBackgroundStyle } from 'utils/backgroundStyle';

// export function Board({ title, background }: BoardProps): JSX.Element {
//   return (
//     <div
//       className="square"
//       style={
//         background.startsWith('data:image')
//           ? {
//               backgroundImage: `url(${background})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               backgroundRepeat: 'no-repeat',
//             }
//           : { backgroundColor: background }
//       }
//     >
//       <h2 className="title">{title}</h2>
//     </div>
//   );
// }
export function Board({ title, background }: BoardProps): JSX.Element {
  return (
    <div className="square" style={getBackgroundStyle(background)}>
      <h2 className="title">{title}</h2>
    </div>
  );
}
